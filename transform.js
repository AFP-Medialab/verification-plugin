// Code from https://stackoverflow.com/questions/76572684/jscodeshift-to-convert-all-named-imports-to-default-import-mui-v5/77150908#77150908
import type { FileInfo, API, Options } from 'jscodeshift';
export default function transform(
    file: FileInfo,
    api: API,
    options: Options,
): string | undefined {
    const j = api.jscodeshift;
    const root = j(file.source);

    // Find all ImportDeclaration nodes
    root.find(j.ImportDeclaration).forEach(path => {
        // Ensure the import source is '@mui/material'
        if (path.node.source.value === '@mui/material') {
            // Ensure the import specifiers are ImportSpecifier nodes
            if (path.node.specifiers.every(specifier => specifier.type === 'ImportSpecifier')) {
                // Create new ImportDeclaration nodes for each ImportSpecifier
                const newImports = path.node.specifiers.map(specifier => {
                    // Ensure the imported element is an Identifier
                    if (specifier.imported.type === 'Identifier') {
                        // Create a new ImportDeclaration node
                        return j.importDeclaration(
                            [j.importDefaultSpecifier(j.identifier(specifier.imported.name))],
                            j.literal(`@mui/material/${specifier.imported.name}`)
                        );
                    }
                });

                // Replace the original ImportDeclaration node with the new ones
                path.replace(...newImports);
            }
        }
    });

    return root.toSource();
}
