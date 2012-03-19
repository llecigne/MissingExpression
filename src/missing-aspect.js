//------------------------------------------------------------------------------
//--- Aspect oriented programming extension ------------------------------------
//------------------------------------------------------------------------------
Function.prototype.skip = function() {};

Function.prototype.weave = function(advice, join)
{
    var f = this;
    var aspect = null;
    if (join == 'before')
    {
	aspect = function() 
	{
	    advice.apply(this, arguments);
	    return f.apply(this, arguments);
	};
    }
    else if (join == 'after')
    {
	aspect = function()
	{
	    var r = f.apply(this, arguments);
	    advice.apply(this, arguments);
	    return r;
	};
    }
    else if (join == 'around')
    {
	var target, args;
	var next = function()
	{ 
	    return f.apply(target, arguments.length == 0 ? args : arguments);
	};
	aspect = function()
	{
	    target = this;
	    args = arguments;
	    advice.next = next;
	    return advice.apply(this, arguments);
	};
    }
    for (var member in advice)
	aspect[member] = advice[member];
    for (var member in f)
	aspect[member] = f[member];
    aspect.toString = function() { return f.toString() };
    aspect.valueOf  = function() { return f.valueOf() };
    aspect.advice   = advice;
    aspect.f        = f;
    aspect.join     = join;
    return aspect;
}

Function.prototype.unweave = function(ad)
{
    if (ad == null)
	return this.f || this;
    if (this.advice == ad)
	return this.f;
    else if (this.f)
    {
	var unweaved = this.f.unweave(ad);
	if (unweaved != this.f)
	    return unweaved.weave(this.advice, this.join);
    }
    return this;
}

Function.prototype.applyBefore = function(advice)
{
    return this.weave(advice, 'before');
}

Function.prototype.applyAfter = function(advice) 
{
    return this.weave(advice, 'after');
}

Function.prototype.applyAround = function(advice)
{
    return this.weave(advice, 'around');
}

Function.prototype.pprint = function()
{
    if (this.advice)
    {
	return this.f.pprint()+"\n"+this.join+":"+this.advice.pprint();
    }
    else
	return this.toString();
}
