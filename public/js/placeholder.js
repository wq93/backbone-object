/*!
 *
 * jQuery Placeholder Text Polyfill
 *
 * @author: @kitajchuk
 * @url: http://github.com/kitajchuk
 *
 *
 */

import $ from 'jquery';

(function ($, window, undefined) {


    "use strict";


    /******************************************************************************
     * jQuery.fn.placeholderText
     *******************************************************************************/
    (function (factory) {

        if (typeof define === "function" && define.amd) {
            define(["jquery"], factory);

        } else {
            factory($);
        }

    })(function ($) {

        var $_body        = $(document.body),

            _polyCSS      = {
                display: "inline-block",
                position: "relative",
                width: "100%",
                border: "0",
                marginBottom: "0"
            },

            _shimCSS      = {
                cursor: "text",
                position: "absolute"
            },

            _cloneTextCSS = [
                "color",
                "letterSpacing",
                "lineHeight",
                "fontFamily",
                "fontSize",
                "fontStyle",
                "fontWeight",
                "textAlign",
                "textDecoration",
                "textTransform"
            ],

            // These props add up to be the absolute offsets
            _cloneShimCSS = {
                bottom: ["borderBottomWidth", "paddingBottom"],
                left: ["borderLeftWidth", "paddingLeft"],
                right: ["borderRightWidth", "paddingRight"],
                top: ["borderTopWidth", "paddingTop"]
            },

            _handleText   = function () {
                var $this = $(this),
                    data  = $this.data();

                if (this.value === "") {
                    data.$shim.text($this.attr("placeholder"));

                } else {
                    data.$shim.text("");
                }
            },

            _pollTimeout,
            _pollForAuto  = function () {
                _pollTimeout = setTimeout(function () {
                    clearTimeout(_pollTimeout);

                    $(".placeholder__is-init").each(function () {
                        _handleText.call(this);
                    });

                    _pollForAuto();

                }, 0);
            };

        $.support.placeholderText = ("placeholder" in document.createElement("input"));


        $.placeholderText = $.extend({
            elemClass: "placeholder-text__elem",
            matchParent: null,
            plugClass: "placeholder-text",
            shimClass: "placeholder-text__shim",
            tagName: "span"

        }, $.placeholderText || {});


        $.fn.placeholderText = function () {
            if ($.support.placeholderText) {
                return this;
            }

            return this.filter("[placeholder]").not(".placeholder__is-init").each(function () {
                var tagName = this.tagName.toLowerCase(),
                    $this   = $(this),
                    $parent = $this.parent(),
                    $shim   = $("<" + $.placeholderText.tagName + " />").addClass($.placeholderText.shimClass);

                if ($.placeholderText.matchParent && $parent.is($.placeholderText.matchParent)) {
                    $parent.addClass($.placeholderText.plugClass).css(_polyCSS);

                } else {
                    $parent = $("<" + $.placeholderText.tagName + " />").addClass($.placeholderText.plugClass);
                    $this.wrap($parent.css(_polyCSS));
                }

                $shim.insertAfter($this);
                $shim.text($this.attr("placeholder"));
                $shim.data("$elem", $this);
                $shim.addClass("placeholder-text__shim--" + tagName);
                $shim.css(_shimCSS);

                $.each(_cloneTextCSS, function (i, prop) {
                    $shim.css(prop, $this.css(prop));
                });

                $.each(_cloneShimCSS, function (prop, props) {
                    var pad = 0;

                    $.each(props, function (i) {
                        var css = parseInt($this.css(props[i]), 10);

                        if (css) {
                            pad = pad + css;
                        }
                    });

                    $shim.css(prop, pad + "px");
                });

                $this.data("$shim", $shim);
                $this.addClass("placeholder__is-init");
                $this.addClass($.placeholderText.elemClass);
            });
        };

        $_body.on("click", "." + $.placeholderText.shimClass, function () {
            $(this).data("$elem").focus();
        });

        $_body.on("keyup keydown keypress", "." + $.placeholderText.elemClass, _handleText);

        $_body.on("blur", "." + $.placeholderText.elemClass, function () {
            try {
                clearTimeout(_pollTimeout);

            } catch (err) {
            }

            _handleText.call(this);
        });

        $_body.on("focus", "." + $.placeholderText.elemClass, function () {
            _pollForAuto();
        });

    });


})($, window);