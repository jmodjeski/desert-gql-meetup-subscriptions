import React, {useState} from 'react';
import { Query } from "react-apollo";
import { gql } from "apollo-boost";
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';


const App: React.FC = () => {
  const [isOpen, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState('');
  const toggle = () => setOpen(!isOpen);
  return (
  <Query
    query={gql`
      {
        scenarios {
          name,
          query
        }
      }
    `}
  >
    {({ loading, error, data } : any) => {
      if (loading) return <p>Loading...</p>;
      if (error) return <p>Error :(</p>;

      return (
        <Dropdown isOpen={isOpen} toggle={toggle}>
        <DropdownToggle caret>{selectedItem || "Pick a scenario"}</DropdownToggle>
        <DropdownMenu>
          {
            data.scenarios.map(({ name }: {name: string}) => 
              (<DropdownItem 
                onClick={()=> setSelectedItem(name)}
                active={selectedItem === name}
              >{name}</DropdownItem>))
          }
        </DropdownMenu>
      </Dropdown>
      );
    }}
  </Query>
  );
}

export default App;
