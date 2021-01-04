
import { Route, Redirect, Switch } from 'react-router-dom';
import Comments from './components/comments';
import './App.css';
import AddEditComment from './components/add-edit-comment';

function App() {
  return (
    <Switch>
      <Route path="/add-edit-comment" component={AddEditComment}></Route>
      <Route path="/comments" component={Comments}></Route>
      <Redirect from='/' exact to='/comments'></Redirect>
      <Redirect to='/not-found'></Redirect>
    </Switch>
  );
}

export default App;
