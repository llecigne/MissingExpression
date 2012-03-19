//------------------------------------------------------------------------------
//--- Memoizer aspect ----------------------------------------------------------
//------------------------------------------------------------------------------
DEFAULT_KEY_GENERATOR = function(args)
{
    var key = '';
    var l = args.length;
    if (l > 0)
    {
	key = args[0].toString();
	for (var i = 1; i < l; i++)
	{
	    key += ',';
	    key += args[i].toString();
	}
    }
    return key;
}
Function.prototype.memoize = function(keyGenerator)
{
    if (!keyGenerator)
	keyGenerator = DEFAULT_KEY_GENERATOR;
    var memoized = this.applyAround(function() 
		   {
		      var key = keyGenerator(arguments);
		      var result = memoized.cache[key];
		      if (!result)
		      {
			  result = arguments.callee.next();
			  memoized.cache[key] = result;
		      }
		      return result;
		   });
    memoized.cache = {};
    return memoized;
}   

//------------------------------------------------------------------------------
//--- Profiler aspect ----------------------------------------------------------
//------------------------------------------------------------------------------
Function.prototype.profile = function()
{
    var profiled = this.applyAround(function() 
		   {
		      var before = new Date();
		      result = arguments.callee.next();
		      profiled.totalTreatmentTime += (new Date() - before);
		      profiled.totalCalls += 1;
		      return result;
		   });
    profiled.averageTreatmentTime = function()
    {
	return this.totalTreatmentTime/this.totalCalls;
    }
    profiled.reset = function()
    {
	this.totalTreatmentTime = 0;
	this.totalCalls = 0;
    }
    profiled.display = function()
    {
	alert("Total calls: "+this.totalCalls+
	      "\n Average treatment time: "+this.averageTreatmentTime()+" ms");
    }
    profiled.reset();
    return profiled;
}

//------------------------------------------------------------------------------
//--- Busy Ajax request --------------------------------------------------------
//------------------------------------------------------------------------------
Ajax.BusyRequest = Class.create();
Ajax.BusyRequest.BUSY_OPTIONS = 
{
    onComplete: function()
    {
	arguments.callee.next();
	document.body.style.cursor = 'default'; 
    }
};
Ajax.BusyRequest.extend(Ajax.Request,
{
    initialize: function(url, params)
    {
	document.body.style.cursor = 'wait';
	Object.extend(params, Ajax.BusyRequest.BUSY_OPTIONS);
	arguments.callee.next();
    }
});

function fib(n)
{
    return (n == 0) ? 0 : ((n == 1) ? 1 : (fib(n-2)+fib(n-1)));
}

