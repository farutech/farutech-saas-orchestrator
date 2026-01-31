cd "src\components\ui"
$components = @(
    "alert-dialog",
    "aspect-ratio",
    "breadcrumb",
    "calendar",
    "carousel",
    "chart",
    "collapsible",
    "command",
    "context-menu",
    "data-table",
    "drawer",
    "dropdown-menu",
    "form",
    "hover-card",
    "menu",
    "menubar",
    "navigation-menu",
    "pagination",
    "popover",
    "progress",
    "resizable",
    "scroll-area",
    "separator",
    "sheet",
    "sidebar",
    "skeleton",
    "slider",
    "sonner",
    "tabs",
    "toast",
    "toaster",
    "toggle-group",
    "toggle"
)

foreach ($component in $components) {
    if (!(Test-Path "$component")) {
        mkdir $component
    }
    if (Test-Path "$component.tsx") {
        mv "$component.tsx" "$component/$component.tsx"
    }
    if (Test-Path "$component.stories.tsx") {
        mv "$component.stories.tsx" "$component/$component.stories.tsx"
    }
    # Create index.ts
    $capital = ($component -split '-' | ForEach-Object { $_.Substring(0,1).ToUpper() + $_.Substring(1) }) -join ''
    $content = "export { $capital } from './$component';"
    if (!(Test-Path "$component/index.ts")) {
        $content | Out-File -FilePath "$component/index.ts" -Encoding UTF8
    }
}