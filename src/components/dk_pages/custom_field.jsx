import React, { useState, useEffect } from "react";
import Head from "../../layout/head/Head";
import Content from "../../layout/content/Content";
import ProductH from "../../images/product/h.png";
import Dropzone from "react-dropzone";
import SimpleBar from "simplebar-react";
import {
    Block,
    BlockHead,
    BlockTitle,
    BlockBetween,
    BlockHeadContent,
    BlockDes,
    Icon,
    Row,
    Col,
    Button,
    DataTableHead,
    DataTableBody,
    DataTableRow,
    DataTableItem,
    PaginationComponent,
} from "../Component";
import { Card, DropdownItem, UncontrolledDropdown, DropdownMenu, DropdownToggle, Badge } from "reactstrap";
import { productData, categoryOptions } from "./ProductData";
import { useForm } from "react-hook-form";
import { Modal, ModalBody } from "reactstrap";
import { RSelect } from "../Component";
import { Spinner } from "reactstrap";

const CustomeFieldList = () => {
    const [data, setData] = useState([]);
    const [folderss, setFoldersData] = useState([]);

    const [inputFields, setInputFields] = useState([
        { name: '', age: '' }
    ])

    const [sm, updateSm] = useState(false);
    const [formData, setFormData] = useState({
        name: [],
        sku: [],
        category: [],
    });
    const [editId, setEditedId] = useState();
    const [view, setView] = useState({
        edit: false,
        add: false,
        details: false,
    });
    const [onSearchText, setSearchText] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemPerPage] = useState(7);
    const [files, setFiles] = useState([]);




    const fetch_Folders_Data = () => {
        fetch("/foldercab", {
            mode: 'cors',
            headers: {
                'Access-Control-Allow-Origin': '*'
            }
        })
            .then((response) => {
                return response.json();
            }).then((datas) => {
                let rows = datas;
                // console.log(rows);

                var arr = [],
                    obj,
                    fruits = rows,
                    i;

                for (i = 0; i < fruits.length; i++) {
                    obj = {}; // <----- new Object

                    obj['value'] = fruits[i]['id'];
                    obj['label'] = fruits[i]['folder_name'];
                    arr.push(obj);
                }

                console.log(arr);
                setFoldersData(arr);
            })
    };



    const fetchAllUsersData = () => {
        fetch("/customfields", {
            mode: 'cors',
            headers: {
                'Access-Control-Allow-Origin': '*'
            }
        })
            .then((response) => {
                return response.json();
            }).then((datas) => {
                let rows = datas;
                console.log(rows);
                setData(rows);
            })
    };
    // Changing state value when searching name
    useEffect(() => {
        if (onSearchText !== "") {
            const filteredObject = data.filter((item) => {
                        if (item.id===parseInt(onSearchText))
                {
                console.log("search "+onSearchText);
                return true;
                }
                // return item.folder_id.toLowerCase().includes(onSearchText.toLowerCase());
                else if (item.field_Name.toLowerCase().includes(onSearchText.toLowerCase())) {
                    return item.field_Name.toLowerCase().includes(onSearchText.toLowerCase());
                }
                else if (item.org_Name.toLowerCase().includes(onSearchText.toLowerCase())) {
                    return item.org_Name.toLowerCase().includes(onSearchText.toLowerCase());
                }
                else if (item.cabinet_Name.toLowerCase().includes(onSearchText.toLowerCase())) {
                    return item.cabinet_Name.toLowerCase().includes(onSearchText.toLowerCase());

                }
                else if (item.folder_Name.toLowerCase().includes(onSearchText.toLowerCase())) {
                    return item.folder_Name.toLowerCase().includes(onSearchText.toLowerCase());

                }
                else if (item.created_On.toLowerCase().includes(onSearchText.toLowerCase())) {
                    return item.created_On.toLowerCase().includes(onSearchText.toLowerCase());

                }
            });
            setData([...filteredObject]);
        } else {
            fetch_Folders_Data();
            fetchAllUsersData();
        }
    }, [onSearchText]);

    // OnChange function to get the input data
    const onInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // category change
    const onCategoryChange = (value) => {
        setFormData({ ...formData, category: value });
    };

    const handleFormChange = (index, event) => {
        let data = [...inputFields];
        data[index][event.target.name] = event.target.value;
        setInputFields(data);
    }

    const addFields = () => {
        let newfield = { name: '', age: '' }

        setInputFields([...inputFields, newfield])
    }
    const removeFields = (index) => {
        let data = [...inputFields];
        data.splice(index, 1)
        setInputFields(data)
    }


    const onCategoryskuChange = (value) => {
        console.log(value.value)



        setFormData({ ...formData, sku: value });
    };
    const onCategorynameChange = (value) => {
        setFormData({ ...formData, name: value });
    };

    // function to close the form modal
    const onFormCancel = () => {
        setView({ edit: false, add: false, details: false });
        resetForm();
    };

    const resetForm = () => {
        setFormData({
            name: [],
            sku: [],
            category: [],
        });
        reset({});
    };

    const onFormSubmit = (form) => {
        const { name, sku } = form;
        let submittedData = {
            id: data.length + 1,
            name: formData.name,
            cabinet: formData.folderss,
            category: formData.category,
        };

        // console.log(multi_folder);
        for (var i = 0; i < inputFields.length; i++) {
            var folder_id = Object.values(formData.sku);
            console.log(folder_id[0]);
            console.log(inputFields[i]['name']);
            var today = new Date();

            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");

            var raw = JSON.stringify({
                "field_name": inputFields[i]['name'],
                "folder_id": folder_id[0],
                "created_on": today,
                "created_by": "1"
            });

            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };

            fetch("/customfield", requestOptions)
                .then(response => response.text())
                .then((result) => {
                    console.log(result);
                    fetchAllUsersData();
                })
                .catch(error => console.log('error', error));



        }

        setData([submittedData, ...data]);

        setView({ open: false });
        setFiles([]);
        setInputFields([]);
        resetForm();
    };

    const onEditSubmit = () => {
        let submittedData;
        let newItems = data;
        let index = newItems.findIndex((item) => item.acl_id === editId);

        newItems.forEach((item) => {
            if (item.acl_id === editId) {
                submittedData = {
                    id: editId,
                    name: formData.name,
                    img: files.length > 0 ? files[0].preview : item.img,
                    sku: formData.sku,
                    price: formData.price,
                    stock: formData.stock,
                    category: formData.category,
                    fav: false,
                    check: false,
                };
            }
        });
        newItems[index] = submittedData;
        //setData(newItems);
        resetForm();
        setView({ edit: false, add: false });
    };

    // function that loads the want to editted data
    const onEditClick = (id) => {
        data.forEach((item) => {
            if (item.acl_id === id) {
                setFormData({
                    name: item.name,
                    img: item.img,
                    sku: item.sku,
                    price: item.price,
                    stock: item.stock,
                    category: item.category,
                    fav: false,
                    check: false,
                });
            }
        });
        setEditedId(id);
        setFiles([]);
        setView({ add: false, edit: true });
    };

    // selects all the Users
    const selectorCheck = (e) => {
        let newData;
        newData = data.map((item) => {
            item.check = e.currentTarget.checked;
            return item;
        });
        setData([...newData]);
    };

    // selects one product
    const onSelectChange = (e, id) => {
        let newData = data;
        let index = newData.findIndex((item) => item.acl_id === id);
        newData[index].check = e.currentTarget.checked;
        setData([...newData]);
    };

    // onChange function for searching name
    const onFilterChange = (e) => {
        setSearchText(e.target.value);
    };

    // function to delete a product
    const deleteProduct = (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
        }).then((result) => {
            if (result.isConfirmed) {

                var requestOptions = {
                    method: 'DELETE',
                    redirect: 'follow'
                };

                fetch("/field/" + id + "", requestOptions)
                    .then(response => response.text())
                    .then((result) => {
                        Swal.fire("Deleted!", "Your file has been deleted.", "success");
                        console.log(result);
                        fetchAllUsersData();
                    })
                    .catch(error => Swal.fire("Error!", error, "Failed"));

            }
        });

    };

    // function to delete the seletected item
    const selectorDeleteProduct = () => {
        let newData;
        newData = data.filter((item) => item.check !== true);
        setData([...newData]);
    };

    // toggle function to view product details
    const toggle = (type) => {
        setView({
            edit: type === "edit" ? true : false,
            add: type === "add" ? true : false,
            details: type === "details" ? true : false,
        });
    };

    // handles ondrop function of dropzone
    const handleDropChange = (acceptedFiles) => {
        setFiles(
            acceptedFiles.map((file) =>
                Object.assign(file, {
                    preview: URL.createObjectURL(file),
                })
            )
        );
    };

    // Get current list, pagination
    const indexOfLastItem = currentPage * itemPerPage;
    const indexOfFirstItem = indexOfLastItem - itemPerPage;
    const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

    // Change Page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const { errors, register, handleSubmit, reset } = useForm();

    return (
        <React.Fragment>
            <Head title="Product List"></Head>
            <Content>
                <BlockHead size="sm">
                    <BlockBetween>
                        <BlockHeadContent>
                            <BlockTitle>Custom Field</BlockTitle>
                        </BlockHeadContent>
                        <BlockHeadContent>
                            <div className="toggle-wrap nk-block-tools-toggle">
                                <a
                                    href="#more"
                                    className="btn btn-icon btn-trigger toggle-expand mr-n1"
                                    onClick={(ev) => {
                                        ev.preventDefault();
                                        updateSm(!sm);
                                    }}
                                >
                                    <Icon name="more-v"></Icon>
                                </a>
                                <div className="toggle-expand-content" style={{ display: sm ? "block" : "none" }}>
                                    <ul className="nk-block-tools g-3">
                                        <li>
                                            <div className="form-control-wrap">
                                                <div className="form-icon form-icon-right">
                                                    <Icon name="search"></Icon>
                                                </div>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="default-04"
                                                    placeholder="Quick search by Unit Name"
                                                    onChange={(e) => onFilterChange(e)}
                                                />
                                            </div>
                                        </li>

                                        <li className="nk-block-tools-opt">
                                            <Button
                                                className="toggle btn-icon d-md-none"
                                                color="primary"
                                                onClick={() => {
                                                    toggle("add");
                                                }}
                                            >
                                                <Icon name="plus"></Icon>
                                            </Button>
                                            <Button
                                                className="toggle d-none d-md-inline-flex"
                                                color="primary"
                                                onClick={() => {
                                                    toggle("add");
                                                }}
                                            >
                                                <Icon name="plus"></Icon>
                                                <span>Add Custom Field</span>
                                            </Button>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </BlockHeadContent>
                    </BlockBetween>
                </BlockHead>
                <Block>
                    <Card className="card-bordered">
                        <div className="card-inner-group">
                            <div className="card-inner p-0">
                                <DataTableBody>
                                    <DataTableHead>
                                        <DataTableRow size="sm">
                                            <span>S.NO</span>
                                        </DataTableRow>
                                        <DataTableRow>
                                            <span>Field Name</span>
                                        </DataTableRow>
                                        <DataTableRow>
                                            <span>Organization Name</span>
                                        </DataTableRow>
                                        <DataTableRow>
                                            <span>Department Name</span>
                                        </DataTableRow>
                                        <DataTableRow size="sm">
                                            <span>Unit Name</span>
                                        </DataTableRow>

                                        <DataTableRow>
                                            <span>Created Time</span>
                                        </DataTableRow>
                                        <DataTableRow className="nk-tb-col-tools">
                                            <span>Action</span>

                                        </DataTableRow>
                                    </DataTableHead>
                                    {currentItems.length > 0
                                        ? currentItems.map((item) => {
                                            return (
                                                <DataTableItem key={item.id}>
                                                    <DataTableRow size="sm">
                                                        <span className="tb-product">

                                                            <span className="title">{item.id}</span>
                                                        </span>
                                                    </DataTableRow>
                                                    <DataTableRow size="sm">
                                                        <span className="tb-product">

                                                            <span className="title">{item.field_Name}</span>
                                                        </span>
                                                    </DataTableRow>
                                                    <DataTableRow>
                                                        <span className="tb-sub">{item.org_Name}</span>
                                                    </DataTableRow>
                                                    <DataTableRow>
                                                        <span className="tb-sub">{item.cabinet_Name}</span>
                                                    </DataTableRow>
                                                    <DataTableRow>
                                                        <span className="tb-sub">{item.folder_Name}</span>
                                                    </DataTableRow>
                                                    <DataTableRow>
                                                        <span className="tb-sub">{item.created_On}</span>
                                                    </DataTableRow>


                                                    <DataTableRow className="nk-tb-col-tools">
                                                        <ul className="nk-tb-actions gx-1 my-n1">
                                                            <li className="mr-n1 w-100">
                                                                <UncontrolledDropdown>
                                                                    <DropdownToggle
                                                                        tag="a"
                                                                        href="#more"
                                                                        onClick={(ev) => ev.preventDefault()}
                                                                        className="dropdown-toggle btn btn-icon btn-trigger"
                                                                    >
                                                                        <Icon name="more-h"></Icon>
                                                                    </DropdownToggle>
                                                                    <DropdownMenu right>
                                                                        <ul className="link-list-opt no-bdr">
                                                                            {/* <li>
                                                                                <DropdownItem
                                                                                    tag="a"
                                                                                    href="#edit"
                                                                                    onClick={(ev) => {
                                                                                        ev.preventDefault();
                                                                                        onEditClick(item.acl_id);
                                                                                        toggle("edit");
                                                                                    }}
                                                                                >
                                                                                    <Icon name="edit"></Icon>
                                                                                    <span>Edit Custom Field</span>
                                                                                </DropdownItem>
                                                                            </li> */}

                                                                            <li>
                                                                                <DropdownItem
                                                                                    tag="a"
                                                                                    href="#remove"
                                                                                    onClick={(ev) => {
                                                                                        ev.preventDefault();
                                                                                        deleteProduct(item.id);
                                                                                    }}
                                                                                >
                                                                                    <Icon name="trash"></Icon>
                                                                                    <span>Delete Custom Field</span>
                                                                                </DropdownItem>
                                                                            </li>
                                                                        </ul>
                                                                    </DropdownMenu>
                                                                </UncontrolledDropdown>
                                                            </li>
                                                        </ul>
                                                    </DataTableRow>
                                                </DataTableItem>
                                            );
                                        })
                                        : null}
                                </DataTableBody>
                                <div className="card-inner">
                                    {data.length > 0 ? (
                                        <PaginationComponent
                                            itemPerPage={itemPerPage}
                                            totalItems={data.length}
                                            paginate={paginate}
                                            currentPage={currentPage}
                                        />
                                    ) : (
                                        <div className="text-center">
                                            <Spinner color="primary" />
                                            <br />
                                            <span className="text-silent">No Custom Field found</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </Card>
                </Block>





                <SimpleBar
                    className={`nk-add-product toggle-slide toggle-slide-right toggle-screen-any ${view.add ? "content-active" : ""
                        }`}
                >
                    <BlockHead>
                        <BlockHeadContent>
                            <BlockTitle tag="h5">Add Custom Field</BlockTitle>
                        </BlockHeadContent>
                    </BlockHead>
                    <Block>
                        <form onSubmit={handleSubmit(onFormSubmit)}>
                            <Row className="g-3">

                                <Col size="12">
                                    <div className="form-group">
                                        <label className="form-label" htmlFor="category">
                                            Units
                                        </label>
                                        <div className="form-control-wrap">
                                            <RSelect
                                                options={folderss}
                                                onChange={onCategoryskuChange}
                                                value={formData.sku}
                                                ref={register({ required: "This is required" })}
                                            />
                                            {errors.sku && <span className="invalid">{errors.sku.message}</span>}

                                        </div>
                                    </div>
                                </Col>
                                <Col size="12">
                                    <div className="form-group">
                                        <label className="form-label" htmlFor="product-title">
                                            Custom Fields Name
                                        </label>
                                        {inputFields.map((input, index) => {
                                            return (
                                                <div className="form-control-wrap">
                                                    <div key={index}>
                                                        <Row className="g-3">
                                                            <Col size="10">
                                                                <input
                                                                    type="text"
                                                                    className="form-control"
                                                                    name="name"
                                                                    onChange={event => handleFormChange(index, event)}
                                                                    ref={register({
                                                                        required: "This field is required",
                                                                    })}
                                                                    defaultValue={formData.name}
                                                                />
                                                            </Col>
                                                            <Col size="2">
                                                                <Button color="danger" onClick={() => removeFields(index)}>
                                                                    <span>X</span>
                                                                </Button>
                                                            </Col>

                                                            {errors.title && <span className="invalid">{errors.title.message}</span>}
                                                        </Row>
                                                    </div>

                                                </div>
                                            )
                                        })}

                                    </div>
                                </Col>
                                <Col size="12 mt-3">
                                    <Button color="primary float-right" onClick={addFields}>
                                        <Icon className="plus"></Icon>
                                        <span>Add More</span>
                                    </Button>
                                </Col>
                                <Col size="12">
                                    <Button color="primary" type="submit">
                                        <Icon className="plus"></Icon>
                                        <span>Add Custom Field</span>
                                    </Button>
                                </Col>
                            </Row>
                        </form>
                    </Block>
                </SimpleBar>

                {view.add && <div className="toggle-overlay" onClick={toggle}></div>}
            </Content>
        </React.Fragment>
    );
};

export default CustomeFieldList;
