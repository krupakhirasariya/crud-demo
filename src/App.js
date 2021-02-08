
import { Route, Redirect, Switch } from 'react-router-dom';
import Comments from './components/comments';
import './App.css';
import AddComment from './components/add-comment';
import EditComment from './components/edit-comment';

function App() {
  return (
    <Switch>
      <Route path="/add-comment" component={AddComment}></Route>
      <Route path="/edit-comment/:id" component={EditComment}></Route>
      <Route path="/comments" component={Comments}></Route>
      <Redirect from='/' exact to='/comments'></Redirect>
      <Redirect to='/not-found'></Redirect>
    </Switch>
  );
}

export default App;
