jht (json-html template) is a small node.js html template parser.

##jht.parse(String, Object)
Accepts a string (presumably) representing an HTML file and an object. Names written in braces such as `{cake}` refer to object properties such as `object.cake`

There are also a few operators...

###{if condition} ... {/if}
Returns the string `...` if `condition` is true, where `condition` is a property of the object (i.e. `object.condition`). Based on length if the property is an Array.

```javascript
query="Hello{if name}, {name}{/if}.";
jht.parse(query, {
    name: "Bob"
    });
```

###{with property} ... {/with}
Similar to JavaScript's `with(object) {}` syntax, properties within this tag are read from `object.property`

```javascript
query="{name}'s son is {with child}{name}, he's {age}{/with}";
jht.parse(query, {
    name: "Bob",
    child: {
        name: "Tommy",
        age: 5
        }
    });
```

###{each property} ... {/each}
Similar to JavaScript's `Array.forEach` function, this tag iterates over `object.property` (which should be an Array) and reads properties from each item in it (which should be Objects).

```javascript
query="{name} has {count children} children: {each children}{name} ({age}), {/each}";
jht.parse(query, {
    name: "Bob",
    children: [
        {
            name: "Tommy",
            age: 5
            },
        {
            name: "Sally",
            age: 6
            }
        ]
    });
```

##jht.compress(String)

Removes typical whitespace `/\r?\n\s*/g` from an HTML string. That's really all it does.