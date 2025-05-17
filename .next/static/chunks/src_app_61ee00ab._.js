(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push([typeof document === "object" ? document.currentScript : undefined, {

"[project]/src/app/theme.ts [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "theme": (()=>theme),
    "themes": (()=>themes)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$styles$2f$createTheme$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__$3c$export__default__as__createTheme$3e$__ = __turbopack_context__.i("[project]/node_modules/@mui/material/styles/createTheme.js [app-client] (ecmascript) <locals> <export default as createTheme>");
;
const theme = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$styles$2f$createTheme$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__$3c$export__default__as__createTheme$3e$__["createTheme"])({
    palette: {
        mode: 'light',
        primary: {
            main: '#1976d2',
            light: '#4791db',
            dark: '#115293',
            contrastText: '#fff'
        },
        background: {
            default: '#f0f2f5',
            paper: '#ffffff'
        },
        text: {
            primary: '#222',
            secondary: '#555'
        }
    },
    typography: {
        fontFamily: [
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif'
        ].join(',')
    },
    components: {
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: '#1976d2'
                }
            }
        },
        MuiToolbar: {
            styleOverrides: {
                root: {
                    minHeight: 60,
                    backgroundColor: '#1976d2'
                }
            }
        }
    }
});
const themes = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$styles$2f$createTheme$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__$3c$export__default__as__createTheme$3e$__["createTheme"])({
    cssVariables: {
        colorSchemeSelector: 'data-toolpad-color-scheme'
    },
    colorSchemes: {
        light: {
            palette: {
                mode: 'light',
                /*
        background: {
          default: '#F9F9FE',
          paper: '#1976d2',//'#EEEEF9',
        },*/ primary: {
                    main: '#1976d2',
                    light: '#63a4ff',
                    dark: '#004ba0',
                    contrastText: '#fff'
                },
                secondary: {
                    main: '#9c27b0',
                    light: '#d05ce3',
                    dark: '#6a0080',
                    contrastText: '#fff'
                },
                text: {
                    primary: '#1A2027',
                    secondary: '#3E5060'
                }
            }
        },
        dark: {
            palette: {
                mode: 'dark',
                background: {
                    default: '#2A4364',
                    paper: '#112E4D'
                },
                primary: {
                    main: '#90caf9',
                    light: '#e3f2fd',
                    dark: '#42a5f5',
                    contrastText: 'rgba(0, 0, 0, 0.87)'
                },
                secondary: {
                    main: '#ce93d8',
                    light: '#f3e5f5',
                    dark: '#ab47bc',
                    contrastText: 'rgba(0, 0, 0, 0.87)'
                },
                text: {
                    primary: '#fff',
                    secondary: 'rgba(255, 255, 255, 0.7)'
                }
            }
        }
    },
    breakpoints: {
        values: {
            xs: 0,
            sm: 600,
            md: 900,
            lg: 1200,
            xl: 1536
        }
    },
    typography: {
        fontFamily: [
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"'
        ].join(',')
    },
    components: {
        MuiAppBar: {
            defaultProps: {
                className: 'appBar'
            },
            styleOverrides: {
                colorPrimary: 'red !important',
                root: {
                    backgroundColor: '#000',
                    color: '#1A2027'
                }
            }
        }
    }
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/app/ThemeWrapper.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$styles$2f$ThemeProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ThemeProvider$3e$__ = __turbopack_context__.i("[project]/node_modules/@mui/material/styles/ThemeProvider.js [app-client] (ecmascript) <export default as ThemeProvider>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$theme$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/theme.ts [app-client] (ecmascript)");
'use client';
;
;
;
// Create a client component wrapper to handle the theme
const ThemeWrapper = ({ children })=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$styles$2f$ThemeProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ThemeProvider$3e$__["ThemeProvider"], {
        theme: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$theme$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["theme"],
        children: children
    }, void 0, false, {
        fileName: "[project]/src/app/ThemeWrapper.tsx",
        lineNumber: 9,
        columnNumber: 7
    }, this);
};
_c = ThemeWrapper;
const __TURBOPACK__default__export__ = ThemeWrapper;
var _c;
__turbopack_context__.k.register(_c, "ThemeWrapper");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
}]);

//# sourceMappingURL=src_app_61ee00ab._.js.map