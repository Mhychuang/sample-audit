import React, { useState, useEffect } from "react";
import { Button, Container, Form, Modal, Table, Alert, useFilters } from "react-bootstrap";
import { useTable } from "react-table";
import axios from "axios";

import "./App.css";

function App() {
    const [pollingPlace, setpollingPlace] = useState([]);
    const [newpollingPlace, setnewpollingPlace] = useState({
        id: "",
        county_id: "",
        name: "",
        hand_count: "",
        machine_count: "",
        count_date: "",
    });
    const [updatePollingPlace, setupdatepollingPlace] = useState({
        updateId: newpollingPlace.id,
        updateCountyId: newpollingPlace.county_id,
        updateName: newpollingPlace.name,
        updatehand_count: newpollingPlace.hand_count,
        updatemachine_count: newpollingPlace.machine_count,
        updatecount_date: newpollingPlace.count_date
    });

    //For error 

    const [errorStatus, seterrorStatus] = useState({
        name: '',
        hand_count: '',
        machine_count: ''
    })

    const [showModal, setShowModal] = useState(false);
    const [actualUpdatingId, setActualUpdatingId] = useState();
    const [actualUpdatingName, setActualUpdatingName] = useState();
    const [actualUpdatingCountyId, setActualUpdatingCountyId] = useState();
    const columns = React.useMemo(
        () => [
            {
                Header: "ID",
                accessor: "id",
            },
            {
                Header: "County ID",
                accessor: "county_id",
            },
            {
                Header: "Name",
                accessor: "name",
            },
            {
                Header: "hand count",
                accessor: "hand_count"
            },
            {
                Header: "machine count",
                accessor: "machine_count",
            },
            {
                Header: "Date",
                accessor: "count_date",
            },
            {
                Header: "Actions",
                accessor: "actions",
                Cell: (row) => (
                    <div>
                        <Button
                            variant="info"
                            size="sm"
                            onClick={() => handleOpenModal(row.cell.row.original.id, row.cell.row.original.name, row.cell.row.original.county_id)}
                        >
                            Edit
            </Button>{" "}
                        <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleDelete(row.cell.row.original.id)}
                        >
                            Delete {row.cell.row.original.name}
            </Button>

                    </div>
                ),
            },
        ],
        []
    );
    const data = [...pollingPlace];
    const tableInstance = useTable({ columns, data });

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = tableInstance;

    useEffect(() => {
        const getPollingPlaces = async () => {
            const res = await axios.get(
                `http://localhost:4000/pollingplaces`
            );
            console.log(res.data)
            setpollingPlace(res.data);
        };
        getPollingPlaces();
    }, []);

    const handleChange = (e) => {

        let checkList = ['hand_count', 'machine_count']
        //console.log(checkList.includes(e.target.name));
        if (checkList.includes(e.target.name) & isNaN(e.target.value)) {
            seterrorStatus({
                ...errorStatus,
                [e.target.name]: " Can only be numbers"
            })
        }
        else {
            seterrorStatus({
                ...errorStatus,
                [e.target.name]: ""
            })
        }

        setnewpollingPlace({
            ...newpollingPlace,
            [e.target.name]: e.target.value
        });
    };

    const handleChangeOnUpdating = (e) => {
        console.log(e.target.name)
        setupdatepollingPlace({
            ...updatePollingPlace,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        //console.log(newpollingPlace)


        const res = await axios.post(
            `http://localhost:4000/pollingplaces`,
            newpollingPlace
        );
        console.log(newpollingPlace);
        console.log(res.data)
        if (res.data.name === "error") alert("This polling place already exists");
        else {
            alert("A new polling place has been added");
            const res = await axios.get(
                `http://localhost:4000/pollingplaces`
            );
            setpollingPlace(res.data);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        const res = await axios.put(
            `http://localhost:4000/pollingplaces/` +
            actualUpdatingId,
            {
                id: updatePollingPlace.id,
                county_id:updatePollingPlace.updateCountyId,
                hand_count: updatePollingPlace.updatehand_count,
                machine_count: updatePollingPlace.updatemachine_count,
                count_date: updatePollingPlace.updatecount_date,
            }
        );
        if (res.data.name === "error") alert("This polling place already exists");
        else {
            alert("The polling place has been updated");
            const res = await axios.get(
                `http://localhost:4000/pollingplaces`
            );
            setpollingPlace(res.data);
            handleCloseModal();
        }
    };

    const handleOpenModal = (id, name,countyid) => {
        setShowModal(true);
        setActualUpdatingId(id);
        setActualUpdatingName(name);
        setActualUpdatingCountyId(countyid)

    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleDelete = async (id) => {
        console.log(id);
        await axios.delete(
            `http://localhost:4000/pollingplaces/` +
            id
        );
        //alert("A polling place has been deleted");
        const res = await axios.get(
            `http://localhost:4000/pollingplaces`
        );
        setpollingPlace(res.data);
    };

    return (
        <Container fluid="sm" className="p-3">
            <h1>Polling Places Counts </h1>

            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="">
                    <Form.Label>County ID </Form.Label>
                    <Form.Control
                        name="county_id"
                        value={newpollingPlace.county_id}
                        type="text"
                        onChange={handleChange}
                    />
                </Form.Group>


                <Form.Group controlId="">
                    <Form.Label>Polling Place name  <span style={{ color: "red" }}>{errorStatus.name}</span></Form.Label>
                    <Form.Control
                        name="name"
                        value={newpollingPlace.name}
                        type="text"
                        onChange={handleChange}
                    />
                </Form.Group>

                <Form.Group controlId="">

                    <Form.Label>Enter Hand Count <span style={{ color: "red" }}>{errorStatus.hand_count}</span></Form.Label>
                    <Form.Control
                        name="hand_count"  //should be the same as previous property
                        value={newpollingPlace.hand_count}

                        placeholder={0}
                        onChange={handleChange}
                    //as="select"
                    >

                    </Form.Control>
                    <Alert variant="danger">{errorStatus.hand_count}</Alert>

                    <Form.Label>Enter Machine Count</Form.Label><span style={{ color: "red" }}>{errorStatus.machine_count}</span>
                    <Form.Control
                        name="machine_count"
                        value={newpollingPlace.machine_count}
                        onChange={handleChange}
                        placeholder={0}
                    //as="select"
                    >

                    </Form.Control>

                    <Form.Group controlId="date">
                        <Form.Label>Date</Form.Label>
                        <Form.Control
                            name="count_date"
                            value={newpollingPlace.count_date}
                            onChange={handleChange}
                            type="date"

                        />
                    </Form.Group>

                    <Button type="submit">Create a new polling place record</Button>
                </Form.Group>
            </Form>



            <h2>Polling place records </h2>


            <Table responsive="sm" striped bordered hover {...getTableProps()}>
                <thead>
                    {headerGroups.map((headerGroup) => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map((column) => (
                                <th {...column.getHeaderProps()}>{column.render("Header")}</th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                    {rows.map((row, i) => {
                        prepareRow(row);
                        return (
                            <tr {...row.getRowProps()}>
                                {row.cells.map((cell) => {
                                    return (
                                        <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                                    );
                                })}
                            </tr>
                        );
                    })}
                </tbody>
            </Table>


            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Editing county: { setActualUpdatingCountyId}:{actualUpdatingName}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleUpdate}>

                        <Form.Group>
                            <Form.Label>Hand Counts</Form.Label>
                            <Form.Control
                                name="updatehand_count"
                                value={updatePollingPlace.updatehand_count}
                                onChange={handleChangeOnUpdating}
                            >
                            </Form.Control>

                            <Form.Label>Machine Counts</Form.Label>
                            <Form.Control
                                name="updatemachine_count"
                                value={updatePollingPlace.updatemachine_count}
                                onChange={handleChangeOnUpdating}

                            >
                            </Form.Control>

                            <Form.Group>
                                <Form.Label> Date</Form.Label>
                                <Form.Control
                                    name="updatecount_date"  //must be the same property name as in the updatePollingPlace
                                    value={updatePollingPlace.updatecount_date}
                                    onChange={handleChangeOnUpdating}
                                    type="date"

                                />
                            </Form.Group>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Close
          </Button>
                    <Button type="submit" onClick={handleUpdate} variant="primary">
                        Save Changes
          </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
}

export default App;
