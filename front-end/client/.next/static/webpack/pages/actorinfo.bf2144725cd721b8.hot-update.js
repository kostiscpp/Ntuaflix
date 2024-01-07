"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
self["webpackHotUpdate_N_E"]("pages/actorinfo",{

/***/ "./pages/actorinfo.tsx":
/*!*****************************!*\
  !*** ./pages/actorinfo.tsx ***!
  \*****************************/
/***/ (function(module, __webpack_exports__, __webpack_require__) {

eval(__webpack_require__.ts("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"../../node_modules/react/jsx-dev-runtime.js\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var styled_jsx_style__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! styled-jsx/style */ \"../../node_modules/styled-jsx/style.js\");\n/* harmony import */ var styled_jsx_style__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(styled_jsx_style__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react */ \"../../node_modules/react/index.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! next/router */ \"../../node_modules/next/router.js\");\n/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(next_router__WEBPACK_IMPORTED_MODULE_3__);\n\nvar _s = $RefreshSig$();\n\n\n\nconst ActorInfo = ()=>{\n    _s();\n    const router = (0,next_router__WEBPACK_IMPORTED_MODULE_3__.useRouter)();\n    const name = router.query.actor;\n    const [actor, setActor] = (0,react__WEBPACK_IMPORTED_MODULE_2__.useState)({\n        primary_name: \"\",\n        birth_year: 0,\n        death_year: 0,\n        biography: \"\",\n        image_url: \"\",\n        primary_profession: [],\n        known_for: [],\n        directs: [],\n        writes: [],\n        principals: []\n    });\n    const home = ()=>{\n        router.push(\"/homepage\");\n    };\n    const find_movie = (title)=>{\n        router.push({\n            pathname: \"/movieinfo\",\n            query: {\n                title: title\n            }\n        });\n    };\n    (0,react__WEBPACK_IMPORTED_MODULE_2__.useEffect)(()=>{\n        try {\n            const fetchActor = async ()=>{\n                const response = await fetch(\"http://localhost:8080/api/actorInfo\", {\n                    method: \"POST\",\n                    headers: {\n                        \"Content-Type\": \"application/json\"\n                    },\n                    body: JSON.stringify({\n                        actor: name\n                    })\n                });\n                const data = await response.json();\n                setActor(data);\n            };\n            fetchActor();\n        } catch (e) {\n            console.log(e);\n        }\n    }, [\n        actor\n    ]);\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n        className: \"jsx-4fb440c411a4cca0\" + \" \" + \"max-w-4xl mx-auto p-4\",\n        children: [\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                className: \"jsx-4fb440c411a4cca0\" + \" \" + \"container\",\n                children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                    className: \"jsx-4fb440c411a4cca0\" + \" \" + \"top-bar\",\n                    children: [\n                        /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                            onClick: home,\n                            className: \"jsx-4fb440c411a4cca0\" + \" \" + \"top-left\",\n                            children: \"Ntuaflix\"\n                        }, void 0, false, {\n                            fileName: \"/home/spyroslkv/Desktop/friendly-octo-waffle/client/pages/actorinfo.tsx\",\n                            lineNumber: 71,\n                            columnNumber: 21\n                        }, undefined),\n                        /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                            className: \"jsx-4fb440c411a4cca0\" + \" \" + \"top-center\",\n                            children: name\n                        }, void 0, false, {\n                            fileName: \"/home/spyroslkv/Desktop/friendly-octo-waffle/client/pages/actorinfo.tsx\",\n                            lineNumber: 74,\n                            columnNumber: 21\n                        }, undefined)\n                    ]\n                }, void 0, true, {\n                    fileName: \"/home/spyroslkv/Desktop/friendly-octo-waffle/client/pages/actorinfo.tsx\",\n                    lineNumber: 70,\n                    columnNumber: 17\n                }, undefined)\n            }, void 0, false, {\n                fileName: \"/home/spyroslkv/Desktop/friendly-octo-waffle/client/pages/actorinfo.tsx\",\n                lineNumber: 69,\n                columnNumber: 13\n            }, undefined),\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                className: \"jsx-4fb440c411a4cca0\" + \" \" + \"padding\"\n            }, void 0, false, {\n                fileName: \"/home/spyroslkv/Desktop/friendly-octo-waffle/client/pages/actorinfo.tsx\",\n                lineNumber: 79,\n                columnNumber: 13\n            }, undefined),\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                className: \"jsx-4fb440c411a4cca0\" + \" \" + \"bg-blue-200 shadow rounded-lg p-6 mb-6 flex\",\n                children: [\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                        className: \"jsx-4fb440c411a4cca0\" + \" \" + \"w-1/3\",\n                        children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"img\", {\n                            src: actor.image_url,\n                            alt: \"Photo of Person\",\n                            className: \"jsx-4fb440c411a4cca0\" + \" \" + \"rounded-lg shadow\"\n                        }, void 0, false, {\n                            fileName: \"/home/spyroslkv/Desktop/friendly-octo-waffle/client/pages/actorinfo.tsx\",\n                            lineNumber: 83,\n                            columnNumber: 21\n                        }, undefined)\n                    }, void 0, false, {\n                        fileName: \"/home/spyroslkv/Desktop/friendly-octo-waffle/client/pages/actorinfo.tsx\",\n                        lineNumber: 81,\n                        columnNumber: 17\n                    }, undefined),\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                        className: \"jsx-4fb440c411a4cca0\" + \" \" + \"w-2/3 ml-6\",\n                        children: [\n                            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"h2\", {\n                                className: \"jsx-4fb440c411a4cca0\" + \" \" + \"text-2xl font-bold mb-1\",\n                                children: actor.primary_name\n                            }, void 0, false, {\n                                fileName: \"/home/spyroslkv/Desktop/friendly-octo-waffle/client/pages/actorinfo.tsx\",\n                                lineNumber: 86,\n                                columnNumber: 21\n                            }, undefined),\n                            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"p\", {\n                                className: \"jsx-4fb440c411a4cca0\" + \" \" + \"text-sm text-gray-600 mb-1\",\n                                children: [\n                                    \"(\",\n                                    actor.primary_profession.join(\", \"),\n                                    \")\"\n                                ]\n                            }, void 0, true, {\n                                fileName: \"/home/spyroslkv/Desktop/friendly-octo-waffle/client/pages/actorinfo.tsx\",\n                                lineNumber: 87,\n                                columnNumber: 21\n                            }, undefined),\n                            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"p\", {\n                                className: \"jsx-4fb440c411a4cca0\",\n                                children: [\n                                    \"Life: \",\n                                    actor.birth_year,\n                                    \" - \",\n                                    actor.death_year\n                                ]\n                            }, void 0, true, {\n                                fileName: \"/home/spyroslkv/Desktop/friendly-octo-waffle/client/pages/actorinfo.tsx\",\n                                lineNumber: 88,\n                                columnNumber: 21\n                            }, undefined),\n                            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"p\", {\n                                className: \"jsx-4fb440c411a4cca0\",\n                                children: [\n                                    \"Biography: \",\n                                    actor.biography\n                                ]\n                            }, void 0, true, {\n                                fileName: \"/home/spyroslkv/Desktop/friendly-octo-waffle/client/pages/actorinfo.tsx\",\n                                lineNumber: 89,\n                                columnNumber: 21\n                            }, undefined)\n                        ]\n                    }, void 0, true, {\n                        fileName: \"/home/spyroslkv/Desktop/friendly-octo-waffle/client/pages/actorinfo.tsx\",\n                        lineNumber: 85,\n                        columnNumber: 17\n                    }, undefined)\n                ]\n            }, void 0, true, {\n                fileName: \"/home/spyroslkv/Desktop/friendly-octo-waffle/client/pages/actorinfo.tsx\",\n                lineNumber: 80,\n                columnNumber: 13\n            }, undefined),\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                className: \"jsx-4fb440c411a4cca0\" + \" \" + \"padding\"\n            }, void 0, false, {\n                fileName: \"/home/spyroslkv/Desktop/friendly-octo-waffle/client/pages/actorinfo.tsx\",\n                lineNumber: 93,\n                columnNumber: 13\n            }, undefined),\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                className: \"jsx-4fb440c411a4cca0\" + \" \" + \"bg-blue-200 rounded-lg py-3 px-4\",\n                children: [\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"h1\", {\n                        className: \"jsx-4fb440c411a4cca0\" + \" \" + \"text-3xl font-bold mb-4 text-center rounded-lg p-6\",\n                        children: \"Known For\"\n                    }, void 0, false, {\n                        fileName: \"/home/spyroslkv/Desktop/friendly-octo-waffle/client/pages/actorinfo.tsx\",\n                        lineNumber: 95,\n                        columnNumber: 17\n                    }, undefined),\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                        className: \"jsx-4fb440c411a4cca0\" + \" \" + \"rounded-lg p-6\",\n                        children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"ul\", {\n                            className: \"jsx-4fb440c411a4cca0\" + \" \" + \"list-disc list-inside\",\n                            children: actor.known_for.map((title)=>/*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"li\", {\n                                    onClick: ()=>find_movie(title),\n                                    className: \"jsx-4fb440c411a4cca0\" + \" \" + \"clickable\",\n                                    children: title\n                                }, void 0, false, {\n                                    fileName: \"/home/spyroslkv/Desktop/friendly-octo-waffle/client/pages/actorinfo.tsx\",\n                                    lineNumber: 99,\n                                    columnNumber: 25\n                                }, undefined))\n                        }, void 0, false, {\n                            fileName: \"/home/spyroslkv/Desktop/friendly-octo-waffle/client/pages/actorinfo.tsx\",\n                            lineNumber: 97,\n                            columnNumber: 21\n                        }, undefined)\n                    }, void 0, false, {\n                        fileName: \"/home/spyroslkv/Desktop/friendly-octo-waffle/client/pages/actorinfo.tsx\",\n                        lineNumber: 96,\n                        columnNumber: 17\n                    }, undefined)\n                ]\n            }, void 0, true, {\n                fileName: \"/home/spyroslkv/Desktop/friendly-octo-waffle/client/pages/actorinfo.tsx\",\n                lineNumber: 94,\n                columnNumber: 13\n            }, undefined),\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                className: \"jsx-4fb440c411a4cca0\",\n                children: [\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"h2\", {\n                        className: \"jsx-4fb440c411a4cca0\",\n                        children: \"Known For:\"\n                    }, void 0, false, {\n                        fileName: \"/home/spyroslkv/Desktop/friendly-octo-waffle/client/pages/actorinfo.tsx\",\n                        lineNumber: 107,\n                        columnNumber: 17\n                    }, undefined),\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"ul\", {\n                        className: \"jsx-4fb440c411a4cca0\",\n                        children: actor.known_for.map((title)=>/*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"li\", {\n                                className: \"jsx-4fb440c411a4cca0\",\n                                children: title\n                            }, void 0, false, {\n                                fileName: \"/home/spyroslkv/Desktop/friendly-octo-waffle/client/pages/actorinfo.tsx\",\n                                lineNumber: 110,\n                                columnNumber: 25\n                            }, undefined))\n                    }, void 0, false, {\n                        fileName: \"/home/spyroslkv/Desktop/friendly-octo-waffle/client/pages/actorinfo.tsx\",\n                        lineNumber: 108,\n                        columnNumber: 17\n                    }, undefined),\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"h2\", {\n                        className: \"jsx-4fb440c411a4cca0\",\n                        children: \"Directs\"\n                    }, void 0, false, {\n                        fileName: \"/home/spyroslkv/Desktop/friendly-octo-waffle/client/pages/actorinfo.tsx\",\n                        lineNumber: 113,\n                        columnNumber: 17\n                    }, undefined),\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"ul\", {\n                        className: \"jsx-4fb440c411a4cca0\",\n                        children: actor.directs.map((title)=>/*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"li\", {\n                                className: \"jsx-4fb440c411a4cca0\",\n                                children: title\n                            }, void 0, false, {\n                                fileName: \"/home/spyroslkv/Desktop/friendly-octo-waffle/client/pages/actorinfo.tsx\",\n                                lineNumber: 116,\n                                columnNumber: 25\n                            }, undefined))\n                    }, void 0, false, {\n                        fileName: \"/home/spyroslkv/Desktop/friendly-octo-waffle/client/pages/actorinfo.tsx\",\n                        lineNumber: 114,\n                        columnNumber: 17\n                    }, undefined),\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"h2\", {\n                        className: \"jsx-4fb440c411a4cca0\",\n                        children: \"Writes\"\n                    }, void 0, false, {\n                        fileName: \"/home/spyroslkv/Desktop/friendly-octo-waffle/client/pages/actorinfo.tsx\",\n                        lineNumber: 119,\n                        columnNumber: 17\n                    }, undefined),\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"ul\", {\n                        className: \"jsx-4fb440c411a4cca0\",\n                        children: actor.writes.map((title)=>/*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"li\", {\n                                className: \"jsx-4fb440c411a4cca0\",\n                                children: title\n                            }, void 0, false, {\n                                fileName: \"/home/spyroslkv/Desktop/friendly-octo-waffle/client/pages/actorinfo.tsx\",\n                                lineNumber: 122,\n                                columnNumber: 25\n                            }, undefined))\n                    }, void 0, false, {\n                        fileName: \"/home/spyroslkv/Desktop/friendly-octo-waffle/client/pages/actorinfo.tsx\",\n                        lineNumber: 120,\n                        columnNumber: 17\n                    }, undefined),\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"h2\", {\n                        className: \"jsx-4fb440c411a4cca0\",\n                        children: \"Principal\"\n                    }, void 0, false, {\n                        fileName: \"/home/spyroslkv/Desktop/friendly-octo-waffle/client/pages/actorinfo.tsx\",\n                        lineNumber: 125,\n                        columnNumber: 17\n                    }, undefined),\n                    actor.principals.map((principal, index)=>/*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"ul\", {\n                            className: \"jsx-4fb440c411a4cca0\",\n                            children: [\n                                /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"li\", {\n                                    className: \"jsx-4fb440c411a4cca0\",\n                                    children: principal.title\n                                }, void 0, false, {\n                                    fileName: \"/home/spyroslkv/Desktop/friendly-octo-waffle/client/pages/actorinfo.tsx\",\n                                    lineNumber: 129,\n                                    columnNumber: 21\n                                }, undefined),\n                                /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"li\", {\n                                    className: \"jsx-4fb440c411a4cca0\",\n                                    children: principal.category\n                                }, void 0, false, {\n                                    fileName: \"/home/spyroslkv/Desktop/friendly-octo-waffle/client/pages/actorinfo.tsx\",\n                                    lineNumber: 130,\n                                    columnNumber: 21\n                                }, undefined),\n                                /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"li\", {\n                                    className: \"jsx-4fb440c411a4cca0\",\n                                    children: principal.characters\n                                }, void 0, false, {\n                                    fileName: \"/home/spyroslkv/Desktop/friendly-octo-waffle/client/pages/actorinfo.tsx\",\n                                    lineNumber: 131,\n                                    columnNumber: 21\n                                }, undefined)\n                            ]\n                        }, index, true, {\n                            fileName: \"/home/spyroslkv/Desktop/friendly-octo-waffle/client/pages/actorinfo.tsx\",\n                            lineNumber: 128,\n                            columnNumber: 21\n                        }, undefined))\n                ]\n            }, void 0, true, {\n                fileName: \"/home/spyroslkv/Desktop/friendly-octo-waffle/client/pages/actorinfo.tsx\",\n                lineNumber: 104,\n                columnNumber: 13\n            }, undefined),\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)((styled_jsx_style__WEBPACK_IMPORTED_MODULE_1___default()), {\n                id: \"4fb440c411a4cca0\",\n                children: \".container.jsx-4fb440c411a4cca0{font-family:Arial,sans-serif;margin:0;padding:0;background-color:#f0f0f0;display:-webkit-box;display:-webkit-flex;display:-moz-box;display:-ms-flexbox;display:flex;-webkit-box-orient:vertical;-webkit-box-direction:normal;-webkit-flex-direction:column;-moz-box-orient:vertical;-moz-box-direction:normal;-ms-flex-direction:column;flex-direction:column;-webkit-box-align:center;-webkit-align-items:center;-moz-box-align:center;-ms-flex-align:center;align-items:center}.top-bar.jsx-4fb440c411a4cca0{background-color:#0074d9;color:#fff;padding:10px;text-align:left;width:100%;display:-webkit-box;display:-webkit-flex;display:-moz-box;display:-ms-flexbox;display:flex;-webkit-box-pack:justify;-webkit-justify-content:space-between;-moz-box-pack:justify;-ms-flex-pack:justify;justify-content:space-between;-webkit-box-align:center;-webkit-align-items:center;-moz-box-align:center;-ms-flex-align:center;align-items:center;max-width:1200px;margin:0 auto}.top-left.jsx-4fb440c411a4cca0{-webkit-box-flex:0;-webkit-flex:0;-moz-box-flex:0;-ms-flex:0;flex:0;font-size:24px;cursor:pointer}.top-center.jsx-4fb440c411a4cca0{-webkit-box-flex:1;-webkit-flex:1;-moz-box-flex:1;-ms-flex:1;flex:1;text-align:center;font-size:24px}.padding.jsx-4fb440c411a4cca0{padding-top:20px}.clickable.jsx-4fb440c411a4cca0{cursor:pointer}\"\n            }, void 0, false, void 0, undefined)\n        ]\n    }, void 0, true, {\n        fileName: \"/home/spyroslkv/Desktop/friendly-octo-waffle/client/pages/actorinfo.tsx\",\n        lineNumber: 68,\n        columnNumber: 9\n    }, undefined);\n};\n_s(ActorInfo, \"GO2C6unfh6Dz2Es0DH3+LqpR/3k=\", false, function() {\n    return [\n        next_router__WEBPACK_IMPORTED_MODULE_3__.useRouter\n    ];\n});\n_c = ActorInfo;\n/* harmony default export */ __webpack_exports__[\"default\"] = (ActorInfo);\nvar _c;\n$RefreshReg$(_c, \"ActorInfo\");\n\n\n;\n    // Wrapped in an IIFE to avoid polluting the global scope\n    ;\n    (function () {\n        var _a, _b;\n        // Legacy CSS implementations will `eval` browser code in a Node.js context\n        // to extract CSS. For backwards compatibility, we need to check we're in a\n        // browser context before continuing.\n        if (typeof self !== 'undefined' &&\n            // AMP / No-JS mode does not inject these helpers:\n            '$RefreshHelpers$' in self) {\n            // @ts-ignore __webpack_module__ is global\n            var currentExports = module.exports;\n            // @ts-ignore __webpack_module__ is global\n            var prevSignature = (_b = (_a = module.hot.data) === null || _a === void 0 ? void 0 : _a.prevSignature) !== null && _b !== void 0 ? _b : null;\n            // This cannot happen in MainTemplate because the exports mismatch between\n            // templating and execution.\n            self.$RefreshHelpers$.registerExportsForReactRefresh(currentExports, module.id);\n            // A module can be accepted automatically based on its exports, e.g. when\n            // it is a Refresh Boundary.\n            if (self.$RefreshHelpers$.isReactRefreshBoundary(currentExports)) {\n                // Save the previous exports signature on update so we can compare the boundary\n                // signatures. We avoid saving exports themselves since it causes memory leaks (https://github.com/vercel/next.js/pull/53797)\n                module.hot.dispose(function (data) {\n                    data.prevSignature =\n                        self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports);\n                });\n                // Unconditionally accept an update to this module, we'll check if it's\n                // still a Refresh Boundary later.\n                // @ts-ignore importMeta is replaced in the loader\n                module.hot.accept();\n                // This field is set when the previous version of this module was a\n                // Refresh Boundary, letting us know we need to check for invalidation or\n                // enqueue an update.\n                if (prevSignature !== null) {\n                    // A boundary can become ineligible if its exports are incompatible\n                    // with the previous exports.\n                    //\n                    // For example, if you add/remove/change exports, we'll want to\n                    // re-execute the importing modules, and force those components to\n                    // re-render. Similarly, if you convert a class component to a\n                    // function, we want to invalidate the boundary.\n                    if (self.$RefreshHelpers$.shouldInvalidateReactRefreshBoundary(prevSignature, self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports))) {\n                        module.hot.invalidate();\n                    }\n                    else {\n                        self.$RefreshHelpers$.scheduleUpdate();\n                    }\n                }\n            }\n            else {\n                // Since we just executed the code for the module, it's possible that the\n                // new exports made it ineligible for being a boundary.\n                // We only care about the case when we were _previously_ a boundary,\n                // because we already accepted this update (accidental side effect).\n                var isNoLongerABoundary = prevSignature !== null;\n                if (isNoLongerABoundary) {\n                    module.hot.invalidate();\n                }\n            }\n        }\n    })();\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,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LE9BQU8sQ0FBQytCLEdBQUcsQ0FBQyxDQUFDekIsc0JBQ2hCLDhEQUFDMEI7OzBDQUFJMUI7Ozs7Ozs7Ozs7O2tDQUdiLDhEQUFDb0I7O2tDQUFHOzs7Ozs7a0NBQ0osOERBQUNJOztrQ0FDSXZDLE1BQU1VLE1BQU0sQ0FBQzhCLEdBQUcsQ0FBQyxDQUFDekIsc0JBQ2YsOERBQUMwQjs7MENBQUkxQjs7Ozs7Ozs7Ozs7a0NBR2IsOERBQUNvQjs7a0NBQUc7Ozs7OztvQkFFSG5DLE1BQU1XLFVBQVUsQ0FBQzZCLEdBQUcsQ0FBQyxDQUFDRSxXQUFnQkMsc0JBQ25DLDhEQUFDSjs7OzhDQUNELDhEQUFDRTs7OENBQUlDLFVBQVUzQixLQUFLOzs7Ozs7OENBQ3BCLDhEQUFDMEI7OzhDQUFJQyxVQUFVRSxRQUFROzs7Ozs7OENBQ3ZCLDhEQUFDSDs7OENBQUlDLFVBQVVHLFVBQVU7Ozs7Ozs7MkJBSGhCRjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBc0Q3QjtHQWxMTS9DOztRQW1CYUQsa0RBQVNBOzs7S0FuQnRCQztBQW9MTiwrREFBZUEsU0FBU0EsRUFBQyIsInNvdXJjZXMiOlsid2VicGFjazovL19OX0UvLi9wYWdlcy9hY3RvcmluZm8udHN4PzRiMjUiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0LCB7IHVzZVN0YXRlLCB1c2VFZmZlY3R9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IHVzZVJvdXRlciB9IGZyb20gJ25leHQvcm91dGVyJztcblxuY29uc3QgQWN0b3JJbmZvID0gKCkgPT4ge1xuICAgIGludGVyZmFjZSBQcmluY2lwYWwge1xuICAgICAgICB0aXRsZTogc3RyaW5nO1xuICAgICAgICBjYXRlZ29yeTogc3RyaW5nO1xuICAgICAgICBjaGFyYWN0ZXJzOiBzdHJpbmdbXTtcbiAgICB9O1xuICAgIGludGVyZmFjZSBBY3RvciB7XG4gICAgICAgIHByaW1hcnlfbmFtZTogc3RyaW5nO1xuICAgICAgICBiaXJ0aF95ZWFyOiBudW1iZXI7XG4gICAgICAgIGRlYXRoX3llYXI6IG51bWJlcjtcbiAgICAgICAgYmlvZ3JhcGh5OiBzdHJpbmc7XG4gICAgICAgIGltYWdlX3VybDogc3RyaW5nO1xuICAgICAgICBwcmltYXJ5X3Byb2Zlc3Npb246IHN0cmluZ1tdO1xuICAgICAgICBrbm93bl9mb3I6IHN0cmluZ1tdO1xuICAgICAgICBkaXJlY3RzOiBzdHJpbmdbXTtcbiAgICAgICAgd3JpdGVzOiBzdHJpbmdbXTtcbiAgICAgICAgcHJpbmNpcGFsczogUHJpbmNpcGFsW107XG4gICAgfTtcblxuICAgIGNvbnN0IHJvdXRlciA9IHVzZVJvdXRlcigpO1xuICAgIGNvbnN0IG5hbWUgPSByb3V0ZXIucXVlcnkuYWN0b3I7XG5cbiAgICBjb25zdCBbYWN0b3IsIHNldEFjdG9yXSA9IHVzZVN0YXRlPEFjdG9yPih7XG4gICAgICAgIHByaW1hcnlfbmFtZTogJycsXG4gICAgICAgIGJpcnRoX3llYXI6IDAsXG4gICAgICAgIGRlYXRoX3llYXI6IDAsXG4gICAgICAgIGJpb2dyYXBoeTogJycsXG4gICAgICAgIGltYWdlX3VybDogJycsXG4gICAgICAgIHByaW1hcnlfcHJvZmVzc2lvbjogW10sXG4gICAgICAgIGtub3duX2ZvcjogW10sXG4gICAgICAgIGRpcmVjdHM6IFtdLFxuICAgICAgICB3cml0ZXM6IFtdLFxuICAgICAgICBwcmluY2lwYWxzOiBbXSxcbiAgICB9KTtcblxuICAgIGNvbnN0IGhvbWUgPSAoKSA9PiB7XG4gICAgICAgIHJvdXRlci5wdXNoKCcvaG9tZXBhZ2UnKTtcbiAgICB9XG4gICAgY29uc3QgZmluZF9tb3ZpZSA9ICh0aXRsZTogc3RyaW5nKSA9PiB7XG4gICAgICAgIHJvdXRlci5wdXNoKHtcbiAgICAgICAgICAgIHBhdGhuYW1lOiAnL21vdmllaW5mbycsXG4gICAgICAgICAgICBxdWVyeTogeyB0aXRsZTogdGl0bGUgfSxcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgdXNlRWZmZWN0KCgpID0+IHsgXG4gICAgICAgIHRyeXtcbiAgICAgICAgICAgIGNvbnN0IGZldGNoQWN0b3IgPSBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChgaHR0cDovL2xvY2FsaG9zdDo4MDgwL2FwaS9hY3RvckluZm9gLCB7XG4gICAgICAgICAgICAgICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICAgICAgICAgICAgICBoZWFkZXJzOiB7ICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicgfSxcbiAgICAgICAgICAgICAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoe2FjdG9yOiBuYW1lIH0pLFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGNvbnN0IGRhdGEgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XG4gICAgICAgICAgICAgICAgc2V0QWN0b3IoZGF0YSk7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgZmV0Y2hBY3RvcigpO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhlKTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICB9LCBbYWN0b3JdKTtcblxuICAgIHJldHVybiAoXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibWF4LXctNHhsIG14LWF1dG8gcC00XCI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbnRhaW5lclwiPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidG9wLWJhclwiPlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRvcC1sZWZ0XCIgb25DbGljaz17aG9tZX0+XG4gICAgICAgICAgICAgICAgICAgICAgICBOdHVhZmxpeFxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0b3AtY2VudGVyXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICB7bmFtZX1cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicGFkZGluZ1wiPjwvZGl2PlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJiZy1ibHVlLTIwMCBzaGFkb3cgcm91bmRlZC1sZyBwLTYgbWItNiBmbGV4XCI+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ3LTEvM1wiPlxuICAgICAgICAgICAgICAgICAgICB7LyogQXNzdW1pbmcgbW92aWVJbmZvLnBvc3Rlcl91cmwgaXMgYSB2YWxpZCBpbWFnZSBVUkwgKi99XG4gICAgICAgICAgICAgICAgICAgIDxpbWcgc3JjPXthY3Rvci5pbWFnZV91cmx9IGFsdD1cIlBob3RvIG9mIFBlcnNvblwiIGNsYXNzTmFtZT1cInJvdW5kZWQtbGcgc2hhZG93XCIgLz5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInctMi8zIG1sLTZcIj5cbiAgICAgICAgICAgICAgICAgICAgPGgyIGNsYXNzTmFtZT1cInRleHQtMnhsIGZvbnQtYm9sZCBtYi0xXCI+e2FjdG9yLnByaW1hcnlfbmFtZX08L2gyPlxuICAgICAgICAgICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJ0ZXh0LXNtIHRleHQtZ3JheS02MDAgbWItMVwiPih7YWN0b3IucHJpbWFyeV9wcm9mZXNzaW9uLmpvaW4oXCIsIFwiKX0pPC9wPlxuICAgICAgICAgICAgICAgICAgICA8cD5MaWZlOiB7YWN0b3IuYmlydGhfeWVhcn0gLSB7YWN0b3IuZGVhdGhfeWVhcn08L3A+XG4gICAgICAgICAgICAgICAgICAgIDxwPkJpb2dyYXBoeToge2FjdG9yLmJpb2dyYXBoeX08L3A+XG5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJwYWRkaW5nXCI+PC9kaXY+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImJnLWJsdWUtMjAwIHJvdW5kZWQtbGcgcHktMyBweC00XCI+XG4gICAgICAgICAgICAgICAgPGgxIGNsYXNzTmFtZT1cInRleHQtM3hsIGZvbnQtYm9sZCBtYi00IHRleHQtY2VudGVyIHJvdW5kZWQtbGcgcC02XCI+S25vd24gRm9yPC9oMT5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvdW5kZWQtbGcgcC02XCI+XG4gICAgICAgICAgICAgICAgICAgIDx1bCBjbGFzc05hbWU9XCJsaXN0LWRpc2MgbGlzdC1pbnNpZGVcIj5cbiAgICAgICAgICAgICAgICAgICAge2FjdG9yLmtub3duX2Zvci5tYXAoKHRpdGxlOiBzdHJpbmcpID0+IChcbiAgICAgICAgICAgICAgICAgICAgICAgIDxsaSBjbGFzc05hbWU9J2NsaWNrYWJsZScgb25DbGljaz17KCkgPT4gZmluZF9tb3ZpZSh0aXRsZSl9Pnt0aXRsZX08L2xpPlxuICAgICAgICAgICAgICAgICAgICApKX1cbiAgICAgICAgICAgICAgICAgICAgPC91bD5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGRpdj5cblxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIDxoMj5Lbm93biBGb3I6PC9oMj5cbiAgICAgICAgICAgICAgICA8dWw+XG4gICAgICAgICAgICAgICAgICAgIHthY3Rvci5rbm93bl9mb3IubWFwKCh0aXRsZSkgPT4gKFxuICAgICAgICAgICAgICAgICAgICAgICAgPGxpPnt0aXRsZX08L2xpPlxuICAgICAgICAgICAgICAgICAgICApKX1cbiAgICAgICAgICAgICAgICA8L3VsPlxuICAgICAgICAgICAgICAgIDxoMj5EaXJlY3RzPC9oMj5cbiAgICAgICAgICAgICAgICA8dWw+XG4gICAgICAgICAgICAgICAgICAgIHthY3Rvci5kaXJlY3RzLm1hcCgodGl0bGUpID0+IChcbiAgICAgICAgICAgICAgICAgICAgICAgIDxsaT57dGl0bGV9PC9saT5cbiAgICAgICAgICAgICAgICAgICAgKSl9XG4gICAgICAgICAgICAgICAgPC91bD5cbiAgICAgICAgICAgICAgICA8aDI+V3JpdGVzPC9oMj5cbiAgICAgICAgICAgICAgICA8dWw+XG4gICAgICAgICAgICAgICAgICAgIHthY3Rvci53cml0ZXMubWFwKCh0aXRsZSkgPT4gKFxuICAgICAgICAgICAgICAgICAgICAgICAgPGxpPnt0aXRsZX08L2xpPlxuICAgICAgICAgICAgICAgICAgICApKX1cbiAgICAgICAgICAgICAgICA8L3VsPlxuICAgICAgICAgICAgICAgIDxoMj5QcmluY2lwYWw8L2gyPlxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIHthY3Rvci5wcmluY2lwYWxzLm1hcCgocHJpbmNpcGFsOiBhbnksIGluZGV4OiBudW1iZXIpID0+IChcbiAgICAgICAgICAgICAgICAgICAgPHVsIGtleT17aW5kZXh9PlxuICAgICAgICAgICAgICAgICAgICA8bGk+e3ByaW5jaXBhbC50aXRsZX08L2xpPlxuICAgICAgICAgICAgICAgICAgICA8bGk+e3ByaW5jaXBhbC5jYXRlZ29yeX08L2xpPlxuICAgICAgICAgICAgICAgICAgICA8bGk+e3ByaW5jaXBhbC5jaGFyYWN0ZXJzfTwvbGk+XG4gICAgICAgICAgICAgICAgICAgIDwvdWw+XG4gICAgICAgICAgICAgICAgKSl9XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxzdHlsZSBqc3g+e2BcbiAgICAgICAgICAgIC5jb250YWluZXIge1xuICAgICAgICAgICAgICBmb250LWZhbWlseTogQXJpYWwsIHNhbnMtc2VyaWY7XG4gICAgICAgICAgICAgIG1hcmdpbjogMDtcbiAgICAgICAgICAgICAgcGFkZGluZzogMDtcbiAgICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogI2YwZjBmMDtcbiAgICAgICAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgICAgICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgICAgICAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuXG4gICAgICAgICAgICAudG9wLWJhciB7XG4gICAgICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogIzAwNzRkOTsgLyogQmx1ZSBjb2xvciAqL1xuICAgICAgICAgICAgICAgIGNvbG9yOiAjZmZmO1xuICAgICAgICAgICAgICAgIHBhZGRpbmc6IDEwcHg7XG4gICAgICAgICAgICAgICAgdGV4dC1hbGlnbjogbGVmdDtcbiAgICAgICAgICAgICAgICB3aWR0aDogMTAwJTtcbiAgICAgICAgICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICAgICAgICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjtcbiAgICAgICAgICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgICAgICAgICAgICAgIG1heC13aWR0aDogMTIwMHB4O1xuICAgICAgICAgICAgICAgIG1hcmdpbjogMCBhdXRvO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAudG9wLWxlZnQge1xuICAgICAgICAgICAgICAgIGZsZXg6IDA7XG4gICAgICAgICAgICAgICAgZm9udC1zaXplOiAyNHB4O1xuICAgICAgICAgICAgICAgIGN1cnNvcjogcG9pbnRlcjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC50b3AtY2VudGVyIHtcbiAgICAgICAgICAgICAgICBmbGV4OiAxO1xuICAgICAgICAgICAgICAgIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgICAgICAgICAgICAgICBmb250LXNpemU6IDI0cHg7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAucGFkZGluZ3tcbiAgICAgICAgICAgICAgICBwYWRkaW5nLXRvcDogMjBweDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgICAgICAuY2xpY2thYmxle1xuICAgICAgICAgICAgICAgIGN1cnNvcjogcG9pbnRlcjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgIGB9PC9zdHlsZT5cbiAgICAgICAgPC9kaXY+XG4gICAgKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgQWN0b3JJbmZvOyJdLCJuYW1lcyI6WyJSZWFjdCIsInVzZVN0YXRlIiwidXNlRWZmZWN0IiwidXNlUm91dGVyIiwiQWN0b3JJbmZvIiwicm91dGVyIiwibmFtZSIsInF1ZXJ5IiwiYWN0b3IiLCJzZXRBY3RvciIsInByaW1hcnlfbmFtZSIsImJpcnRoX3llYXIiLCJkZWF0aF95ZWFyIiwiYmlvZ3JhcGh5IiwiaW1hZ2VfdXJsIiwicHJpbWFyeV9wcm9mZXNzaW9uIiwia25vd25fZm9yIiwiZGlyZWN0cyIsIndyaXRlcyIsInByaW5jaXBhbHMiLCJob21lIiwicHVzaCIsImZpbmRfbW92aWUiLCJ0aXRsZSIsInBhdGhuYW1lIiwiZmV0Y2hBY3RvciIsInJlc3BvbnNlIiwiZmV0Y2giLCJtZXRob2QiLCJoZWFkZXJzIiwiYm9keSIsIkpTT04iLCJzdHJpbmdpZnkiLCJkYXRhIiwianNvbiIsImUiLCJjb25zb2xlIiwibG9nIiwiZGl2Iiwib25DbGljayIsImltZyIsInNyYyIsImFsdCIsImgyIiwicCIsImpvaW4iLCJoMSIsInVsIiwibWFwIiwibGkiLCJwcmluY2lwYWwiLCJpbmRleCIsImNhdGVnb3J5IiwiY2hhcmFjdGVycyJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./pages/actorinfo.tsx\n"));

/***/ })

});