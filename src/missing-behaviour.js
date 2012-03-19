Css.Behaviour = function() 
{
    var visit = function(func, from)
    {
	if (!from.tagName)
	    return;
	func(from);
	for (var i = 0, c; c = from.childNodes[i]; i++)
	    visit(func, c);
    }

    var foo = function(e)
    {
	for (var i = 0, s; s = Css.Behaviour.behaviours[i]; i++)
	{
	    if (s.match(e))
		s._apply(e);
	}
    }
    
    //--------------------------------------------------------------------------
    //--- DOM traversal convenience functions ----------------------------------
    //--------------------------------------------------------------------------
    var locked = false;
    var applyElement = function(element)
    {
	for (var i = 0, s; s = Css.Behaviour.behaviours[i]; i++)
	    if (s.match(element))
		s.matched.push(element);
    };
    return {
	behaviours: [],
	register: function(behaviours)
	{
	    for (var cssExpression in behaviours)
	    {
		var selectors = $C(cssExpression);
                for (var i = 0, s; s = selectors[i]; i++)
		{
		    s.behaviour = behaviours[cssExpression];
		    Css.Behaviour.behaviours.push(s);
		}
	    }
	    Css.Behaviour.behaviours.sort(Css.Selector.comparator);
	},
	apply: function(from)
	{
	    // Does nothing while behaviours application is in progress.
	    //
	    if (locked)
		return;
	    locked = true;
	    try
	    {
		if (!from) from = document.body;
		visit(foo, from);
		// for (var i = 0, s; s = Css.Behaviour.behaviours[i]; i++)
		// {
		//     var matched = s.select(from);
		//     for (var j = 0, e; e = matched[j]; j++) 
		// 	s._apply(e);
		// }
	    }
	    finally 
	    {
		locked = false;
	    }
	}
    }
} ();

(function() {
    var bootstrap = function() { Css.Behaviour.apply() };
    window.onload = (window.onload instanceof Function) ?
	window.onload.applyAfter(bootstrap) : bootstrap;
})();
