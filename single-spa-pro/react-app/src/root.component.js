import { BrowserRouter, Link, Route, Switch, Redirect } from "react-router-dom";
import home from "./components/home";
import about from "./components/about";

export default function Root(props) {
  return (
    <BrowserRouter basename="/react">
      <section>{props.name} is mounted!</section>
      <Link to="/">首页</Link>
      <Link to="/about">关于</Link>
      <div>{JSON.stringify(props)}</div>
      <Switch>
        <Route path="/" exact component={home}></Route>
        <Route path="/about" component={about}></Route>
        <Redirect to="/"></Redirect>
      </Switch>
    </BrowserRouter>
  );
}
