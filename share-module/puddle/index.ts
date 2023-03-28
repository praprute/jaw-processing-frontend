import { createReduxModule } from '@moonshot-team/saga-toolkit'

import { MODULE_NAME } from './type'
import * as tasks from './task'

export const puddleModule = createReduxModule({
    moduleName: MODULE_NAME,
    initialState: {},
    tasks,
})
