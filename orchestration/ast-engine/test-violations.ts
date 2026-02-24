import React from 'react'; // Rule 3: unused import
import { useState } from 'react'; // Rule 3: unused import
import unused from 'unused'; // Rule 3: unused import

// Rule 1: explicit any type
let anyValue: any = 5;

// Rule 4: anonymous default export
export default (props) => <div>{props.name}</div>;

// Rule 5: deep nesting
function level1() {
  function level2() {
    function level3() {
      function level4() {
        function level5() {
          return 'nested too deep';
        }
      }
    }
  }
}

// Rule 8: duplicated types
type UserType = { id: number; name: string };
type DupType = { id: number; name: string };

// Rule 6: prop drilling
function Parent(props) {
  return <Child {...props} />;
}

function Child(props) {
  return <GrandChild {...props} />;
}

function GrandChild(props) {
  return <GreatGrandChild {...props} />;
}

function GreatGrandChild(props) {
  return <div>{props.value}</div>;
}
