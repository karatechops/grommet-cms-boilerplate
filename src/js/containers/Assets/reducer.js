import * as ActionTypes from './constants';

const initialState = {
  request: false,
  error: '',
  currentPage: 1,
  totalCount: 0,
  perPage: 9,
  posts: []
};

function assets(state = initialState, action) {
  switch(action.type) {
    case ActionTypes.ASSETS_COUNT_SUCCESS:
      return {
        ...state,
        totalCount: action.count
      };
    case ActionTypes.ASSETS_SET_PAGE:
      return {
        ...state,
        currentPage: action.page
      };
    case ActionTypes.ASSETS_CLEAR_POSTS:
      return {
        ...state,
        posts: [],
        currentPage: 1
      };
    case ActionTypes.ASSETS_REQUEST:
      return {
        ...state,
        request: true
      };
    case ActionTypes.ASSETS_SUCCESS:
      return {
        ...state,
        request: false,
        error: '',
        posts: [
          ...state.posts,
          ...action.posts
        ]
      };
    case ActionTypes.ASSETS_ERROR:
      return {
        ...state,
        request: false,
        error: action.error
      };
    case ActionTypes.ASSETS_DELETE_SUCCESS:
      return {
        ...state,
        request: false,
        error: ''
      };
    default:
      return state;
  }
}

export default assets;
