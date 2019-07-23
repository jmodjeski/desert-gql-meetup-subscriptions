import React, {useState} from 'react';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import Examples, {SCENARIO_MAP} from './examples';

const App: React.FC = () => {
  const [isOpen, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(SCENARIO_MAP.pubsub);
  const toggle = () => setOpen(!isOpen);
  return (
    <React.Fragment>
      <Dropdown isOpen={isOpen} toggle={toggle}>
        <DropdownToggle caret>{selectedItem}</DropdownToggle>
        <DropdownMenu>
          {
            Object.values(SCENARIO_MAP).map((scenario) =>
              <DropdownItem
                active={selectedItem === scenario}
                onClick={()=> setSelectedItem(scenario)}
              >{scenario}</DropdownItem>
            )
          }
        </DropdownMenu>
      </Dropdown>

      <Examples scenario={selectedItem}/>
    </React.Fragment>
  );
}

export default App;
