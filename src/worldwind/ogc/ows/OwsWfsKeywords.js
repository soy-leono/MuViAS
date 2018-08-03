/*
 * Copyright 2018 WorldWind Contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * @exports OwsKeywords
 */
define([
        '../../error/ArgumentError',
        '../../util/Logger',
        '../../ogc/ows/OwsLanguageString'
    ],
    function (ArgumentError,
              Logger,
              OwsLanguageString) {
        "use strict";

        var OwsKeywords = function (element) {
            if (!element) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "OwsKeywords", "constructor", "missingDomElement"));
            }

            //   console.log(element.localName);
            var children = element.children || element.childNodes;
            if (children.length === 1) {
                this.keywords = element.textContent;
            }

            else {
                for (var c = 0; c < children.length; c++) {
                    var child = children[c];
                    if (child.localName === "keyword" || child.localName === "Keyword") {
                        this.keywords = this.keywords || [];
                        this.keywords.push(new OwsLanguageString(child));
                    }
                }
            }
        };

        return OwsKeywords;
    });