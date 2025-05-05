import type { FileInfo, API, Options } from 'jscodeshift';

export default function transform(
  file: FileInfo,
  api: API,
  options: Options,
): string | undefined {
  const j = api.jscodeshift;
  const root = j(file.source);

  const muiModules = [
    "Accordion",
    "AccordionActions",
    "AccordionDetails",
    "AccordionSummary",
    "Alert",
    "AlertTitle",
    "AppBar",
    "Autocomplete",
    "Avatar",
    "AvatarGroup",
    "Backdrop",
    "Badge",
    "BottomNavigation",
    "BottomNavigationAction",
    "Box",
    "Breadcrumbs",
    "Button",
    "ButtonBase",
    "ButtonGroup",
    "ButtonGroupButtonContext",
    "ButtonGroupContext",
    "Card",
    "CardActionArea",
    "CardActions",
    "CardContent",
    "CardHeader",
    "CardMedia",
    "Checkbox",
    "Chip",
    "CircularProgress",
    "ClickAwayListener",
    "Collapse",
    "Container",
    "CssBaseline",
    "CssVarsProvider",
    "Dialog",
    "DialogActions",
    "DialogContent",
    "DialogContentText",
    "DialogTitle",
    "Divider",
    "Drawer",
    "Experimental_CssVarsProvider",
    "Fab",
    "Fade",
    "FilledInput",
    "FormControl",
    "FormControlLabel",
    "FormGroup",
    "FormHelperText",
    "FormLabel",
    "FormLabelRoot",
    "GlobalStyles",
    "Grid",
    "Grid",
    "Grow",
    "Hidden",
    "Icon",
    "IconButton",
    "ImageList",
    "ImageListItem",
    "ImageListItemBar",
    "Input",
    "InputAdornment",
    "InputBase",
    "InputLabel",
    "LinearProgress",
    "Link",
    "List",
    "ListItem",
    "ListItemAvatar",
    "ListItemButton",
    "ListItemIcon",
    "ListItemSecondaryAction",
    "ListItemText",
    "ListSubheader",
    "Menu",
    "MenuItem",
    "MenuList",
    "MobileStepper",
    "Modal",
    "ModalManager",
    "NativeSelect",
    "NoSsr",
    "OutlinedInput",
    "Pagination",
    "PaginationItem",
    "Paper",
    "Popover",
    "PopoverPaper",
    "PopoverRoot",
    "Popper",
    "Portal",
    "Radio",
    "RadioGroup",
    "Rating",
    "ScopedCssBaseline",
    "Select",
    "Skeleton",
    "Slide",
    "Slider",
    "SliderMark",
    "SliderMarkLabel",
    "SliderRail",
    "SliderRoot",
    "SliderThumb",
    "SliderTrack",
    "SliderValueLabel",
    "Snackbar",
    "SnackbarContent",
    "SpeedDial",
    "SpeedDialAction",
    "SpeedDialIcon",
    "Stack",
    "Step",
    "StepButton",
    "StepConnector",
    "StepContent",
    "StepContext",
    "StepIcon",
    "StepLabel",
    "Stepper",
    "StepperContext",
    "StyledEngineProvider",
    "SvgIcon",
    "SwipeableDrawer",
    "Switch",
    "Tab",
    "TabScrollButton",
    "Table",
    "TableBody",
    "TableCell",
    "TableContainer",
    "TableFooter",
    "TableHead",
    "TablePagination",
    "TableRow",
    "TableSortLabel",
    "Tabs",
    "TextField",
    "TextareaAutosize",
    "ToggleButton",
    "ToggleButtonGroup",
    "Toolbar",
    "Tooltip",
    "Typography",
    "Zoom"
  ]

  root.find(j.ImportDeclaration).forEach(path => {
    if (path.node.source.value === '@mui/material') {
      const specifiersToTransform = path.node.specifiers.filter(
        specifier =>
          specifier.type === 'ImportSpecifier' &&
          specifier.imported.type === 'Identifier' &&
          muiModules.includes(specifier.imported.name)
      );

      if (specifiersToTransform.length > 0) {
        // Create new ImportDeclaration nodes for the specifiers to transform
        const newImports = specifiersToTransform.map(specifier => {
          return j.importDeclaration(
            [j.importDefaultSpecifier(j.identifier(specifier.imported.name))],
            j.literal(`@mui/material/${specifier.imported.name}`)
          );
        });

        // Create a new ImportDeclaration node for the remaining specifiers like "styled", which must come from "@mui/material"
        const remainingSpecifiers = path.node.specifiers.filter(
          specifier => !specifiersToTransform.includes(specifier)
        );
        const newRemainingImport = j.importDeclaration(
          remainingSpecifiers,
          j.literal('@mui/material')
        );

        // Replace the original ImportDeclaration node with the new ones
        if (remainingSpecifiers.length > 0) {
          path.replace(...newImports, newRemainingImport);
        }
        else {
          path.replace(...newImports);
        }
      }
    }
  });

  return root.toSource();
}
