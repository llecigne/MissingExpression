//------------------------------------------------------------------------------
//--- Javascript inheritance extension -----------------------------------------
//------------------------------------------------------------------------------
Object.ext = function(object, extension)
{
    for (var member in object)
    {
	if (extension.hasOwnProperty(member))
	{
	    var objectImpl = object[member];
	    var extensionImpl = extension[member];
	    if ((objectImpl instanceof Function) && (extensionImpl instanceof Function))
	    {
		extension[member] = objectImpl.applyAround(extensionImpl);
		continue;
	    }
	}
	extension[member] = object[member];
    }
    return extension;
}

Object.overload = function(object, extension)
{
    extension = Object.clone(extension);
    for (var member in object)
    {
	if (extension.hasOwnProperty(member))
	{
	    var objectImpl = object[member];
	    var extensionImpl = extension[member];
	    if ((objectImpl instanceof Function) && (extensionImpl instanceof Function))
		extension[member] = objectImpl.applyAfter(extensionImpl);
	}
	else
	    extension[member] = object[member];
    }
    return extension;
}

Function.prototype.extend = function(ancestor, extension)
{
    if (extension)
	this.prototype = extension;
    Object.ext(ancestor instanceof Function ? ancestor.prototype : ancestor, 
	       this.prototype);
    return this;
}
