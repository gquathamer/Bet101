import React from 'react';
import Table from 'react-bootstrap/Table';
import Container from 'react-bootstrap/Container';
import Placeholder from 'react-bootstrap/Placeholder';

export default class PlaceholderTable extends React.Component {
  render() {
    return (
      <Container>
        <Table bordered className='mt-5' id={this.props.id} fluid="md">
          <thead>
            <tr className="td-no-wrap">
              {
                this.props.headerRow.map(elem => {
                  return <th key={elem} className='align-middle table-data-20'>{elem}</th>;
                })
              }
            </tr>
          </thead>
          <tbody>
            {
              [...Array(this.props.numRows)].map((elem, idx) => {
                return (
                  <tr key={idx} className='td-no-wrap td-quarter'>
                    {
                      this.props.headerRow.map(elem => {
                        return (
                          <Placeholder key={elem} as="td" animation="glow">
                            <Placeholder xs={12} />
                          </Placeholder>
                        );
                      })
                    }
                  </tr>
                );
              })
            }
          </tbody>
        </Table>
      </Container>
    );
  }
}
