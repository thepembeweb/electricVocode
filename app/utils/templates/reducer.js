import { upperUnderscoreWords, camelCaseWords } from '../wordMethods';

const reducer = input => {
  const constant = input.length ? upperUnderscoreWords(input) : 'ACTION';
  const actionCreator = input.length ? camelCaseWords(input) : 'doAction';
  return `/**
 * ACTION TYPES
 */
const ${constant} = '${constant}'

/**
 * ACTION CREATORS
 */
const ${actionCreator} = info => ({type: ${constant}, info})

/**
 * THUNK CREATORS
 */
const Thunk = args => dispatch => {
  /*ASYNC REQUEST*/
};

/**
 * REDUCER
 */

const defaultState = {
  hello: 'hello'
}

export default function (state = defaultState, action) {
  switch (action.type) {
    case ${constant}:
      return action.info
    default:
      return state
  }
}
`;
};

export default reducer;
