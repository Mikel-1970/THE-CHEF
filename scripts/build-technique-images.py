#!/usr/bin/env python3
import argparse
import base64
import io
import json
import os
import re
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

import requests
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parents[1]
MASTER = ROOT / "src/data/theChefTechniquesMaster.json"
MEDIA_GATEWAY = ROOT / "src/services/mediaGateway.ts"
PUBLIC_ROOT = ROOT / "public/technique-images"
THUMB_ROOT = PUBLIC_ROOT / "thumb"
DETAIL_ROOT = PUBLIC_ROOT / "detail"
MANIFEST = ROOT / "src/data/techniqueImageManifest.json"


def parse_defaults():
    text = MEDIA_GATEWAY.read_text(encoding="utf-8")
    url = os.getenv("CHEF_MEDIA_API_URL") or re.search(r"VITE_RECIPE_API_URL\s*\|\|\s*'([^']+)'", text).group(1)
    key = os.getenv("CHEF_MEDIA_API_KEY") or re.search(r"VITE_RECIPE_API_KEY\s*\|\|\s*'([^']+)'", text).group(1)
    return url.rstrip("/"), key


def fetch_source(api_url, api_key, technique, retries=3):
    payload = {
        "recipe": {
            "title": f"Técnica culinaria: {technique['nombre']}",
            "description": technique.get("image_prompt") or technique.get("definicion_corta") or technique["nombre"],
            "cuisine": "Técnica culinaria",
            "style": "Fotografía didáctica premium, proceso visible, sin texto",
            "ingredients": [{"name": name} for name in technique.get("ingredientes_habituales", [])[:8]],
        }
    }
    headers = {"Content-Type": "application/json", "apikey": api_key, "Authorization": f"Bearer {api_key}"}
    error = None
    for attempt in range(1, retries + 1):
        try:
            response = requests.post(f"{api_url}/chef-media/image", headers=headers, json=payload, timeout=180)
            response.raise_for_status()
            data = response.json()
            if data.get("imageBase64"):
                return base64.b64decode(data["imageBase64"])
            if data.get("imageUrl"):
                image_response = requests.get(data["imageUrl"], timeout=120)
                image_response.raise_for_status()
                return image_response.content
            raise RuntimeError("La API no devolvió imageBase64 ni imageUrl.")
        except Exception as exc:
            error = exc
            if attempt < retries:
                time.sleep(2 * attempt)
    raise RuntimeError(f"No se pudo generar {technique['nombre']}: {error}")


def save_variants(raw_bytes, technique_id):
    THUMB_ROOT.mkdir(parents=True, exist_ok=True)
    DETAIL_ROOT.mkdir(parents=True, exist_ok=True)
    thumb_path = THUMB_ROOT / f"{technique_id}.webp"
    detail_path = DETAIL_ROOT / f"{technique_id}.webp"

    with Image.open(io.BytesIO(raw_bytes)) as image:
        image = ImageOps.exif_transpose(image).convert("RGB")
        thumb = ImageOps.fit(image, (360, 480), method=Image.Resampling.LANCZOS)
        detail = ImageOps.fit(image, (960, 540), method=Image.Resampling.LANCZOS)
        thumb.save(thumb_path, "WEBP", quality=48, method=6)
        detail.save(detail_path, "WEBP", quality=62, method=6)

    return {
        "thumb": f"technique-images/thumb/{technique_id}.webp",
        "detail": f"technique-images/detail/{technique_id}.webp",
    }


def build_one(api_url, api_key, technique, force=False):
    tid = technique["id"]
    thumb = THUMB_ROOT / f"{tid}.webp"
    detail = DETAIL_ROOT / f"{tid}.webp"
    if not force and thumb.exists() and detail.exists():
        return tid, {
            "thumb": f"technique-images/thumb/{tid}.webp",
            "detail": f"technique-images/detail/{tid}.webp",
        }, "cached"
    raw = fetch_source(api_url, api_key, technique)
    entry = save_variants(raw, tid)
    return tid, entry, "generated"


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--workers", type=int, default=int(os.getenv("TECHNIQUE_IMAGE_WORKERS", "3")))
    parser.add_argument("--limit", type=int, default=0)
    parser.add_argument("--force", action="store_true")
    args = parser.parse_args()

    api_url, api_key = parse_defaults()
    data = json.loads(MASTER.read_text(encoding="utf-8"))
    techniques = data["tecnicas"][: args.limit or None]
    items = {}
    generated = 0
    cached = 0
    failures = []

    with ThreadPoolExecutor(max_workers=max(1, args.workers)) as pool:
        futures = {pool.submit(build_one, api_url, api_key, t, args.force): t for t in techniques}
        for future in as_completed(futures):
            technique = futures[future]
            try:
                tid, entry, state = future.result()
                items[tid] = entry
                generated += state == "generated"
                cached += state == "cached"
                print(f"[{len(items)}/{len(techniques)}] {state}: {technique['nombre']}", flush=True)
            except Exception as exc:
                failures.append({"id": technique["id"], "nombre": technique["nombre"], "error": str(exc)})
                print(f"ERROR {technique['nombre']}: {exc}", flush=True)

    if failures:
        (PUBLIC_ROOT / "failures.json").write_text(json.dumps(failures, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        raise SystemExit(f"Fallaron {len(failures)} técnicas; no se actualiza el manifiesto.")

    ordered = {t["id"]: items[t["id"]] for t in techniques if t["id"] in items}
    MANIFEST.write_text(json.dumps({
        "version": 1,
        "generatedAt": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "items": ordered,
    }, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"OK: {generated} generadas, {cached} reutilizadas. Manifiesto: {len(ordered)} imágenes.")


if __name__ == "__main__":
    main()
