import {
    CryptoIdAdapter,
    DateFnsClockAdapter,
    DexieProgressAdapter,
    SqlJsContentAdapter,
    TsFsrsReviewAdapter,
} from "@guesant/saberes-adapter-data-v1";
import type { AppDependencies } from "@guesant/saberes-core";

export function createAppDependencies(): AppDependencies {
    return {
        content: new SqlJsContentAdapter(),
        progress: new DexieProgressAdapter(),
        scheduler: new TsFsrsReviewAdapter(),
        clock: new DateFnsClockAdapter(),
        ids: new CryptoIdAdapter(),
    };
}
