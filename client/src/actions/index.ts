import { ArchiveAction } from "./Archive";
import { PersistentUiAction } from "./PersistentUi";
import { AuthAction } from "./Auth";
import { HomeAction } from "./Home";

export type AppAction = ArchiveAction | HomeAction | AuthAction | PersistentUiAction;
