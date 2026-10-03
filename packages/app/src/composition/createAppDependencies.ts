import {
    CryptoIdAdapter,
    DataStudyAdapter,
    DateFnsClockAdapter,
    DexieProgressAdapter,
    SqlJsContentAdapter,
    TsFsrsReviewAdapter,
} from "@guesant/saberes-adapter-data-v1";
import type { ApplicationPorts } from "@guesant/saberes-application";

export function createAppDependencies(): ApplicationPorts {
    return {
        content: new SqlJsContentAdapter(),
        progress: new DexieProgressAdapter(),
        scheduler: new TsFsrsReviewAdapter(),
        study: new DataStudyAdapter(),
        clock: new DateFnsClockAdapter(),
        ids: new CryptoIdAdapter(),
    };
}
