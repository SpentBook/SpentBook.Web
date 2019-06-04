import { ToolbarComponent } from "../components/toolbar/toolbar.component";

export abstract class PageInterface {
    abstract setToolBar(header: ToolbarComponent) : void;
}