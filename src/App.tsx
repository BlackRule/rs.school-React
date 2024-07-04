import { Component, ReactNode } from "react";

class Button extends Component<{ children: ReactNode; onClick: () => void }> {
  render() {
    return (
      <button
        className="bg-gray-300 active:bg-gray-200 hover:bg-gray-100 p-1"
        onClick={this.props.onClick}
      >
        {this.props.children}
      </button>
    );
  }
}

class Search extends Component<
  { onClickOrMount: (value: string) => void },
  { value: string }
> {
  static VALUE_KEY = "search_term";

  state = { value: "" };

  componentDidMount() {
    let v = localStorage.getItem(Search.VALUE_KEY);
    if (v === null) v = "";
    this.setState({ value: v });
    this.props.onClickOrMount(v);
  }

  onClickOrMount = () => {
    this.props.onClickOrMount(this.state.value);
    localStorage.setItem(Search.VALUE_KEY, this.state.value);
  };

  render() {
    return (
      <div className="flex gap-1">
        <input
          type="text"
          className="border"
          placeholder="search query"
          value={this.state.value}
          onChange={(e) => this.setState({ value: e.target.value })}
        />
        <Button onClick={this.onClickOrMount}>Search</Button>
      </div>
    );
  }
}

type Product = {
  title: string;
  description: string;
  id: number;
};

class Items extends Component<{
  items: null | Product[];
}> {
  render() {
    if (this.props.items === null) return <div>loader</div>;
    return (
      <div className="flex flex-col gap-2">
        {this.props.items.map((item) => (
          <div className="border-2" key={item.id}>
            <div>{item.title}</div>
            <div>{item.description}</div>
          </div>
        ))}
      </div>
    );
  }
}

class App extends Component {
  state = {
    items: null as Product[] | null,
  };
  onClickOrMountSearch = async (v: string) => {
    v = v.trim();
    const response = (await fetch(
      `https://dummyjson.com/products/search?select=title,description,number&q=${v}`,
    ).then((res) => res.json())) as {
      products: [Product];
      total: number;
      skip: number;
      limit: number;
    };
    this.setState({
      items: response.products,
    });
  };

  onClickError = () => null;

  render() {
    return (
      <div className="p-6 flex flex-col gap-2">
        <div className="flex gap-5">
          <Search onClickOrMount={this.onClickOrMountSearch} />
          <Button onClick={() => this.setState({ items: 8 })}>
            Throw an error
          </Button>
        </div>
        <Items items={this.state.items} />
      </div>
    );
  }
}

export default App;
