var Feature = function()
{
    return this.initialize.apply(this, arguments);
};
Feature.Browser = {
    Safari: 'Safari',
    Opera: 'Opera',
    Mozilla: 'Mozilla',
    Ie: 'MSIE'
};
Feature.available = [];
Feature.display = function()
{
    alert(this.available.join(', '));
}
Feature.isAvailable = function(featureName)
{
    for (var i = 0; i < this.available.length; i++)
    {
	if (this.available[i].name == featureName)
	    return true;
    }
    return false;
}
Feature.require = function()
{
    for (var i = 0; i < arguments.length; i++)
    {
	if (!this.isAvailable(arguments[i]))
	    throw 'Unable to load ['+name+']: missing dependency ['+arguments[i]+'].';
    }
}
Feature.provide = function(feature)
{
    for (var i = 0; i < arguments.length; i++)
	Feature.available.push(feature);
}
Feature.when = function(mapping)
{
    for (feature in mapping)
    {
	feature.split(/\s*,\s*/).each(function(feature) { 
		if (this.isAvailable(feature))
		    return mapping[feature];
	    });
    }
    return null;
}
Feature.start = function()
{
    // Browser detection.
    //
    for (var browser in this.Browser)
    {
	var match;
	if (match = new RegExp(this.Browser[browser]+"(?:/([^\ ]*))?").exec(navigator.userAgent))
	{
	    this.provide(new Feature(this.Browser[browser], match[1]));
	}
    }

    // Popular framework detection.
    //
    //if (Prototype == undefined) this.provide(new Feature("prototype", Prototype.Version));
}
Feature.prototype.initialize = function(name, version, depends)
{
    if (!name) throw 'Feature name cannot be null or empty.'
    this.name    = name;
    this.version = version;
    if (depends) Feature.require(depends);
}
Feature.prototype.toString = function()
{
    if (this.version)
	return this.name+'/'+this.version;
    return this.name;
}

Feature.start();