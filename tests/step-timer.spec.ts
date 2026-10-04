import {test,expect} from '@playwright/test';
import {stepTimerSeconds} from '../src/utils/stepTimer';
for(const [instruction,seconds] of [['Bate las yemas hasta que aclaren.',0],['Monta las claras durante 4 minutos.',0],['Calienta 70 g de mermelada.',0],['Hornea la masa durante 22 minutos.',1320],['Deja reposar 20 minutos.',1200],['Refrigera 10 minutos.',600],['Hornea hasta que esté dorado.',0],['Hornea entre 20 y 25 minutos.',0],['Hornea 10 minutos y deja reposar 20 minutos.',0]] as const){test(instruction,()=>expect(stepTimerSeconds({number:1,instruction,minutes:4})).toBe(seconds))}
