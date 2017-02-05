import fetch from 'isomorphic-fetch';
import * as ActionTypes from './constants';
import { browserHistory } from 'react-router';
import { debounce } from 'grommet-cms/utils';

export function assetsRequest(showLoading) {
  return {
    type: ActionTypes.ASSETS_REQUEST,
    showLoading
  };
}

export function assetsSuccess(posts: Array<Asset>) {
  return {
    type: ActionTypes.ASSETS_SUCCESS,
    posts
  };
}

export function assetsError(errorMsg) {
  return {
    type: ActionTypes.ASSETS_ERROR,
    error: errorMsg
  };
}

export function assetsClearPosts() {
  return {
    type: ActionTypes.ASSETS_CLEAR_POSTS
  };
}

export function assetsDeleteSuccess() {
  return {
    type: ActionTypes.ASSETS_DELETE_SUCCESS
  };
}

export function assetsCountSuccess(count) {
  return {
    type: ActionTypes.ASSETS_COUNT_SUCCESS,
    count
  };
}

export function assetsSetPage(page) {
  return {
    type: ActionTypes.ASSETS_SET_PAGE,
    page
  };
}

export function assetsIncrementPage() {
  return function(dispatch, getState) {
    const { currentPage } = getState().assets;
    debounce(
      dispatch(
        assetsSetPage(currentPage + 1)
      ),
      5000,
      true
    );
  };
}

// Delete asset.
export function deleteAsset(id) {
  return (dispatch, getState) => {
    dispatch(assetsRequest());
    let { url } = getState().api;
    fetch(`${url}/file/${id}/delete`, {
      method: 'POST',
      credentials: 'include',
      headers: new Headers({
        'Content-Type': 'application/json'
      })
    })
      .then(
        ({ status, statusText }) => {
          if (status >= 400) {
            const text = statusText;
            dispatch(assetsError(text));
          } else {
            // Refresh posts.
            dispatch(getAssets());
            dispatch(assetsDeleteSuccess());
          }
        },
        err => {
          // Switch this out for Dashboard error.
          dispatch(assetsError('There was an error processing your request.'));
        }
      );
  };
}

// Create Asset.
export function submitAsset(data, forwardWhenDone = true) {
  const endPoint = (!data.id)
    ? 'file/create'
    : `file/edit/${data.id}`;
  let formData = new FormData();

  for(let name in data) {
    formData.append(name, data[name]);
  }

  return (dispatch, getState) => {
    let { url } = getState().api;

    dispatch(assetsRequest());
    return fetch(`${url}/${endPoint}`, {
      method: 'POST',
      credentials: 'include',
      body: formData,
      headers: {
        'Accept': 'application/json, */*'
      }
    })
      .then(response => 
        response.json().then(json => ({
          status: response.status,
          statusText: response.statusText,
          json
        })
      ))
      .then(
        ({ status, statusText, json }) => {
          if (status >= 400) {
            console.log('dispatching error:', status, statusText, json);
            dispatch(assetsError(statusText));
          } else {
            dispatch(assetsSuccess(json));
            if (forwardWhenDone) browserHistory.push('/dashboard/assets');
          }
        },
        err => {
          // dispatch app error
          console.log(err);
          dispatch(assetsError('There was an error processing your request.'));
        }
      );
  };
}

// Get Assets list. 
// This route is auth protected to avoid publicly listing a site's full list 
// of resources/assets.
export function getAssets(page, showLoading = true) {
  return (dispatch, getState) => {
    if (showLoading) {
      dispatch(assetsRequest());
    }
    let { url } = getState().api;
    return fetch(`${url}/files?page=${page}`, {
      method: 'GET',
      mode: 'cors',
      credentials: 'include',
      headers: new Headers({
        'Content-Type': 'application/json'
      })
    })
      .then(response =>
        response.json().then(json => ({
          status: response.status,
          statusText: response.statusText,
          json
        })
      ))
      .then(
        ({ status, statusText, json }) => {
          if (status >= 400) {
            const text = statusText;
            dispatch(assetsError(text));
          } else {
            dispatch(assetsSuccess(json));
          }
        },
        err => {
          // Switch this out for Dashboard error.
          dispatch(assetsError('There was an error processing your request.'));
        }
      );
  };
}

export function getAssetsTotalCount() {
  return (dispatch, getState) => {
    dispatch(assetsRequest());
    let { url } = getState().api;
    return fetch(`${url}/assets-count`, {
      method: 'GET',
      mode: 'cors',
      credentials: 'include',
      headers: new Headers({
        'Content-Type': 'application/json'
      })
    })
    .then(res => res.json())
    .then(json => {
      dispatch(assetsCountSuccess(json.total));
    })
    .catch(_ => {
      dispatch(assetsError('There was an error processing your request.'));
    });
  };
}

// Get Asset
export function getAsset(id) {
  return (dispatch, getState) => {
    dispatch(assetsRequest());
    let { url } = getState().api;
    return fetch(`${url}/file?id=${id}`, {
      method: 'GET',
      mode: 'cors',
      credentials: 'include',
      headers: new Headers({
        'Content-Type': 'application/json'
      })
    })
      .then(response =>
        response.json().then(json => ({
          status: response.status,
          statusText: response.statusText,
          json
        })
      ))
      .then(
        ({ status, statusText, json }) => {
          if (status >= 400) {
            const text = statusText;
            dispatch(assetsError(text));
          } else {
            dispatch(assetsSuccess(json));
          }
        },
        err => {
          // Switch this out for Dashboard error.
          dispatch(assetsError('There was an error processing your request.'));
        }
      );
  };
}
