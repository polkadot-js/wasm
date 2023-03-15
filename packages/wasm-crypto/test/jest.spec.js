// Copyright 2019-2023 @polkadot/wasm-crypto authors & contributors
// SPDX-License-Identifier: Apache-2.0
/// <reference types="@polkadot/dev-test/node.d.ts" />
import * as wasm from '../build/index.js';
import { initRun, tests } from './all/index.js';
describe('wasm-crypto', () => {
    beforeAll(() => initRun('wasm', wasm));
    for (const name of Object.keys(tests)) {
        describe(name, () => {
            Object
                .values(tests[name])
                .forEach((fn) => fn(wasm));
        });
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiamVzdC5zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiamVzdC5zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLG1FQUFtRTtBQUNuRSxzQ0FBc0M7QUFFdEMsc0RBQXNEO0FBRXRELE9BQU8sS0FBSyxJQUFJLE1BQU0sbUJBQW1CLENBQUM7QUFDMUMsT0FBTyxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUVoRCxRQUFRLENBQUMsYUFBYSxFQUFFLEdBQVMsRUFBRTtJQUNqQyxTQUFTLENBQUMsR0FBRyxFQUFFLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDO0lBRXZDLEtBQUssTUFBTSxJQUFJLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRTtRQUNyQyxRQUFRLENBQUMsSUFBSSxFQUFFLEdBQVMsRUFBRTtZQUN4QixNQUFNO2lCQUNILE1BQU0sQ0FBMEIsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO2lCQUM1QyxPQUFPLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQy9CLENBQUMsQ0FBQyxDQUFDO0tBQ0o7QUFDSCxDQUFDLENBQUMsQ0FBQyJ9
//# sourceHash=e065780ec5891c69f47f6f29ac73cefb5049c2efba641b88784cd3378fd09547