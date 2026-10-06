import Add from "@mui/icons-material/Add";
import Anchor from "@mui/icons-material/Anchor";
import Checklist from "@mui/icons-material/Checklist";
import AccountTree from "@mui/icons-material/AccountTree";
import ArchiveOutlined from "@mui/icons-material/ArchiveOutlined";
import ArrowBack from "@mui/icons-material/ArrowBack";
import ArrowForward from "@mui/icons-material/ArrowForward";
import BookmarkAdded from "@mui/icons-material/BookmarkAdded";
import BookmarkBorder from "@mui/icons-material/BookmarkBorder";
import Check from "@mui/icons-material/Check";
import Close from "@mui/icons-material/Close";
import DeleteOutline from "@mui/icons-material/DeleteOutline";
import Download from "@mui/icons-material/Download";
import EditOutlined from "@mui/icons-material/EditOutlined";
import FilterList from "@mui/icons-material/FilterList";
import HelpOutline from "@mui/icons-material/HelpOutline";
import LibraryBooks from "@mui/icons-material/LibraryBooks";
import Link from "@mui/icons-material/Link";
import MoreHoriz from "@mui/icons-material/MoreHoriz";
import NoteAlt from "@mui/icons-material/NoteAlt";
import PendingActions from "@mui/icons-material/PendingActions";
import Pause from "@mui/icons-material/Pause";
import PlayArrow from "@mui/icons-material/PlayArrow";
import Refresh from "@mui/icons-material/Refresh";
import Reply from "@mui/icons-material/Reply";
import SaveOutlined from "@mui/icons-material/SaveOutlined";
import Search from "@mui/icons-material/Search";
import School from "@mui/icons-material/School";
import SettingsOutlined from "@mui/icons-material/SettingsOutlined";
import SelectAll from "@mui/icons-material/SelectAll";
import ThumbUp from "@mui/icons-material/ThumbUp";
import Topic from "@mui/icons-material/Topic";
import Upload from "@mui/icons-material/Upload";
import type { UIButtonActionIconName } from "./get-button-action-icon-name.function";
import type { ReactElement } from "react";

const actionIcons = {
    all: SelectAll,
    add: Add,
    anchor: Anchor,
    backlink: Reply,
    checklist: Checklist,
    dependsOn: AccountTree,
    archive: ArchiveOutlined,
    arrowBack: ArrowBack,
    arrowForward: ArrowForward,
    bookmark: BookmarkBorder,
    check: Check,
    close: Close,
    delete: DeleteOutline,
    download: Download,
    edit: EditOutlined,
    filter: FilterList,
    help: HelpOutline,
    link: Link,
    known: Check,
    materials: LibraryBooks,
    more: MoreHoriz,
    note: NoteAlt,
    reference: LibraryBooks,
    reminder: PendingActions,
    pause: Pause,
    play: PlayArrow,
    refresh: Refresh,
    save: SaveOutlined,
    search: Search,
    settings: SettingsOutlined,
    supports: ThumbUp,
    uncertain: HelpOutline,
    unknown: School,
    topic: Topic,
    upload: Upload,
} satisfies Record<UIButtonActionIconName, typeof Add>;

export interface UIButtonActionIconProps {
    name: UIButtonActionIconName;
    pressed?: boolean;
}

export function UIButtonActionIcon(
    props: UIButtonActionIconProps,
): ReactElement {
    let Icon = actionIcons[props.name];

    if (props.name === "bookmark" && props.pressed) {
        Icon = BookmarkAdded;
    }

    return <Icon fontSize="small" />;
}
