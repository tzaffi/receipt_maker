(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module unless amdModuleId is set
    define([], function () {
      return (root['ReceiptMaker'] = factory());
    });
  } else if (typeof exports === 'object') {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node.
    module.exports = factory();
  } else {
    root['ReceiptMaker'] = factory();
  }
}(this, function () {

/*!
 * Receipt Maker v0.1.0
 * https://github.com/tzaffi/receipt_maker
 *
 * Copyright 2015 Szymon Nowak
 * Released under the MIT license
 *
 * Thanks [Szymon Nowak](https://github.com/szimek/signature_pad)
 * for your beautiful javascript -which I have 'ripped off'
 * and coded around 
 */
var ReceiptMaker = (function (document) {
    "use strict";

    var ReceiptMaker = function (canvas, signaturePad, options) {
        var self = this,
            opts = options || {};

	this._canvas = canvas;
	this._ctx = canvas.getContext("2d");
	this._signaturePad = signaturePad;
	
	var oldFont = this._ctx.font;
	var oldFillStyle = this._ctx.fillStyle;
	var width = this._canvas.offsetWidth;
	var height = this._canvas.offsetHeight;

	
	//Modify the signature pad upon contruction	
	//Hint at a signature area:
	this._construct = function() {
	    this._ctx.rect(20, height/2, width-40, height/2 - 20);
	    this._ctx.stroke();
	};

	this._elementGetterFactory = function(id){
	    return function(){
		return document.getElementById(id).value;
	    }
	};

	this._getNameOrCompany = this._elementGetterFactory("nameOrCompany");
	this._getServiceRendered = this._elementGetterFactory("serviceRendered");
	this._getServiceDate = this._elementGetterFactory("serviceDate");
	this._getAmountReceived = this._elementGetterFactory("amountReceived");
	this._getContactInfo = this._elementGetterFactory("contactInfo");


        this._printReceipt = function ( nameOrCompany, serviceRendered,
					dateOfService, amountReceived, 
					contactInfo) {

	    var font = "12px Courier";
	    var fillStyle = "blue";

	    var lineSpace = 14;
	    var leftMargin = 20;
	    this._ctx.font = font;
	    this._ctx.fillStyle = fillStyle;
	    
	    this._ctx.fillText("Name or Company:           " + nameOrCompany, leftMargin, lineSpace);
	    this._ctx.fillText("Service Rendered:          " + serviceRendered, leftMargin, 2*lineSpace);
	    this._ctx.fillText("Date of Service:           " + dateOfService, leftMargin, 3*lineSpace);
	    this._ctx.fillText("Amount Received:           " + amountReceived, leftMargin, 4*lineSpace);
	    this._ctx.fillText("Contact Information:       " + contactInfo, leftMargin, 5*lineSpace);
	    
	    font = "8px Arial";
	    this._ctx.font = font;
	    this._ctx.fillText("<<<<<<<<<<<<<   " + Date() + "  >>>>>>>>>>>>>>", leftMargin, 6*lineSpace);
	    
	    font = "20px Arial";
	    this._ctx.font = font;
	    this._ctx.fillText("SIGNED:", leftMargin, height/2-lineSpace);
	    
	    this._ctx.font = oldFont;
	    this._ctx.fillStyle = oldFillStyle;
	    /* and time stamp */
	};

	this._construct();
    };

    ReceiptMaker.prototype.toDataURL = function (imageType, quality) {
        var canvas = this._canvas;
	var ctx = this._ctx;
	var signaturePad = this._signaturePad;
	var nameOrCompany = this._getNameOrCompany();
	var serviceRendered = this._getServiceRendered();
	var serviceDate = this._getServiceDate();
	var amountReceived = this._getAmountReceived();
	var contactInfo = this._getContactInfo();
	this._printReceipt(nameOrCompany, serviceRendered,
			   serviceDate, amountReceived, contactInfo);
        return signaturePad.toDataURL(imageType, quality);
	//return canvas.toDataURL.apply(canvas, arguments);
    };

    /*
      Finish receipt_maker: just add entries for 
      var ctx = canvas.getContext("2d");
      ctx.font = "30px Arial";
      ctx.fillText("Hello World",10,50);
    */
    return ReceiptMaker;
})(document);

return ReceiptMaker;

}));
