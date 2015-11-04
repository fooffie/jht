function parse(input, json) {
	var	index=0,
		otag=null,
		ctag=null,
		array=null,
		content="",
		template="";
	while(otag=findtag(input, index, false)) {
		index=otag.start;
		if(ctag=findtag(input, otag.end, true, otag.expr||otag.tag)) {
			if(otag.expr==="each") {
				array=json[otag.tag];
				content="";
				template=input.substring(otag.end, ctag.start);
				for(var i=0; i<array.length; ++i) {
					content+=parse(template, array[i]);
					}
				input=input.substring(0, otag.start)
					+content
					+input.substring(ctag.end, input.length);
				index=otag.start+content.length;
				}
			else if(otag.expr==="with") {
				content=parse(
					input.substring(otag.end, ctag.start),
					json[otag.tag]
					);
				input=input.substring(0, otag.start)
					+content
					+input.substring(ctag.end, input.length);
				index=otag.start+content.length;
				}
			else/* if(otag.expr==="if") */{
				if(json[otag.tag]) {
					if(json[otag.tag].constructor!==Array || json[otag.tag].length) {
						input=input.substring(0, otag.start)
							+input.substring(otag.end, ctag.start)
							+input.substring(ctag.end, input.length);
						continue;
						}
					}
				input=input.substring(0, otag.start)
					+input.substring(ctag.end, input.length);
				}
			}
		else if(otag.expr==="count") {
			input=input.substring(0, otag.start)
				+json[otag.tag].length
				+input.substring(otag.end, input.length);
			}
		else {
			input=input.substring(0, otag.start)
				+escape(String(json[otag.tag]))
				+input.substring(otag.end, input.length);
			}
		}
	return input;
	};
function escape(string) {
	return string
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/\{/g, "&#123;")
		.replace(/\}/g, "&#125;");
	};
function findtag(input, start, close, match) {
	var	tag="",
		expr="";
	for(var i=start, j=0, k=0; i<input.length; ++i) {
		if(input[i]==="{") {
			if(input[i+1]==="/"===close) {
				j=close?i+2:i+1;
				for(k=j; k<input.length; ++k) {
					if(input[k]===" ") {
						expr=input.substring(j, k);
						j=k+1;
						}
					else if(input[k]==="}") {
						tag=input.substring(j, k);
						if(close && tag!==match) {
							continue;
							}
						return {
							start: i,
							end: k+1,
							tag: tag,
							expr: expr,
							};
						}
					}
				}
			}
		}
	return 0;
	};
module.exports={
	parse: parse,
	compress: function(string) {
		return string.replace(/\r?\n\s*/g, "");
		}
	};