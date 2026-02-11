import { Route, Router } from "@solidjs/router";
import MentorsPage from "@/pages/MentorsPage";

function App() {
  return (
    <Router>
      <Route path="/" component={MentorsPage} />
      <Route path="/mentors" component={MentorsPage} />
    </Router>
  );
}

export default App;
