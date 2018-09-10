import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

const DEFAULT_QUERY = 'redux';
const DEFAULT_HPP= '10';

const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';
const PARAM_PAGE = 'page=';
const PARAM_HPP='hitsPerPage=';

const url = `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${DEFAULT_QUERY}&${PARAM_PAGE}`;
console.log(url);



const userService = {
  getUserName(user) {
    return user.firstName + ' ' + user.lastName;
  },
}

const isSearched = searchTerm => item => item.title.toLowerCase().includes(searchTerm.toLowerCase());


const Button = ({
  onClick,
  className = '',
  children, }) => {

  return (
    <button
      onClick={onClick}
      className={className}
      type="button"
    >
      {children}
    </button>
  );

}
const Search = ({ value, onChange,onSubmit, children }) => {
  return (
    <form onSubmit={onSubmit}>
      <input type="text" value={value} onChange={onChange} >
      </input>
      <button type="submit" >
      {children}
      </button>
    </form>
  );

}
const largeColumn = {
  width: '40%',
};
const midColumn = {
  width: '30%',
};
const smallColumn = {
  width: '10%',
};

const Table = ({ list, onDismiss }) => {

  return (
    <div className="table">
      {list.map(item =>
        <div key={item.objectID} className="table-row">
          <span style={largeColumn}>
            <a href={item.url}> {item.title} </a>
          </span>
          <span style={midColumn} >
            {item.author}
          </span>
          <span style={smallColumn}>
            {item.num_comments}
          </span>
          <span style={smallColumn}>
            {item.points}
          </span>
          <span style={smallColumn}>
            <Button onClick={() => onDismiss(item.objectID)} className="button-inline">
              Dismiss
              </Button>
          </span>
        </div>
      )}
    </div>
  );

}






class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      results: null,
      searchKey:'',
      searchTerm: DEFAULT_QUERY,
      error: null,
    };

    this.setSearchTopStories = this.setSearchTopStories.bind(this);
    this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);
    this.onSearchSubmit = this.onSearchSubmit.bind(this);
    
    this.onDismiss = this.onDismiss.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.needsToSearchTopStories = this.needsToSearchTopStories.bind(this);

  }

  setSearchTopStories(result) {
    const{ hits, page}=result;
    const{ searchKey, results}=this.state;

    const oldHits= results && results[searchKey] ? results[searchKey].hits:[];
    const updateHits = [ ...oldHits, ...hits];
    this.setState(
      {results: { ...results , 
        [searchKey]:{ hits: updateHits, page } }}
      );
  }

  fetchSearchTopStories(searchTerm,page='0') {
    fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${DEFAULT_QUERY}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`)
      .then(response => response.json())
      .then(result => this.setSearchTopStories(result))
      .catch(e => this.setState({error: e}));
  }

  onSearchSubmit(event){
    const { searchTerm } = this.state;
    this.setState({searchKey:searchTerm});

    if (this.needsToSearchTopStories(searchTerm)) {
      this.fetchSearchTopStories(searchTerm);
     }

    event.preventDefault();

  }
  componentDidMount() {
    const { searchTerm } = this.state;
    this.setState({searchKey:searchTerm})
    this.fetchSearchTopStories(searchTerm);
  }


  onDismiss(id) {
    const {results,searchKey} = this.state;
    const { hits, page } = results[searchKey];
    const isNotId = item => item.objectID !== id;
    const updatedHits = hits.filter(isNotId);
    this.setState({
      results: { ...results,[searchKey]:{ hits: updatedHits,page}
     }
    });
  }

  onSearchChange(event) {
    this.setState({ searchTerm: event.target.value });
  }
  needsToSearchTopStories(searchTerm) {
    return !this.state.results[searchTerm];
  }

  render() {

    const { searchTerm, results,searchKey,error } = this.state;
    const page=(results &&
      results[searchKey] &&
      results[searchKey].page) || 0;

    const list = (results &&
      results[searchKey] &&
      results[searchKey].hits) || [];

    if (error) { return <p>Something went wrong.</p>; }

    return (
      <div className="page">
      <div className="interactions" >
        <form>
          <label>Name:</label> <input type="text" value={person.firstname.concat('.',person.lastname)} />
        </form>
      </div>
        <div className="interactions">
          <Search
            value={searchTerm}
            onChange={this.onSearchChange} 
            onSubmit={this.onSearchSubmit} >
            Search
          </Search>

        </div>
        {error?
        <div className='interactions' >
          <p>Something went wrong.</p>
        </div>
        : <Table
            list={list}
            onDismiss={this.onDismiss} />
        }
        <div>
          <Button onClick={ ()=>this.fetchSearchTopStories(searchKey,page+1)} >
          More
          </Button>
        </div>
         

      </div>
    );
  }
}

export default App;
// export default ExplainBindingComponent;
