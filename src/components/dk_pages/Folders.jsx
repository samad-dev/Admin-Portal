import React, { useState, useEffect } from "react";
import Head from "../../layout/head/Head";
import Content from "../../layout/content/Content";
import ProductH from "../../images/product/h.png";
import Dropzone from "react-dropzone";
import SimpleBar from "simplebar-react";
import { Alert, UncontrolledAlert, Spinner } from "reactstrap"
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

const FolderList = () => {
  const [data, setData] = useState([]);
  const [orga, setOrgzData] = useState([]);
  const [cabinets, setCabinetData] = useState([]);
  const [sm, updateSm] = useState(false);
  const [isShow, setIsShow] = useState(true);
  const [isdelete, setIsdel] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    category: [],
    sku: [],
  });
  const [editOrgId, setEditedOrgId] = useState();
  const [editCabId, setEditedCabId] = useState();

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
  var rights;
  var cr, del, upd, vi;

  const fetch_Cabinets_Data = () => {
    fetch("/cabinets", {
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
          obj['label'] = fruits[i]['cabinet_name'];
          arr.push(obj);
        }

        // console.log(arr);
        setCabinetData(arr);
      })
  };

  const fetchAllCabinetsData = () => {
    fetch("/foldercab", {
      mode: 'cors',
      headers: {
        'Access-Control-Allow-Origin': '*'
      }
    })
      .then((response) => {
        return response.json();
      }).then((datas) => {
        let Folders = datas;
        console.log(Folders);
        setData(Folders);
      rights = localStorage.getItem("folder_tab");
      console.log(localStorage.getItem("folder_tab"));
      rights = rights.replaceAll("'", '"');
      console.log("Samad " + rights);
      const obj = JSON.parse(rights);
      console.log(obj.create + ", " + obj.update);
      cr = obj.create;
      upd = obj.update;
      vi = obj.view;
      del = obj.delete;
      if (obj.create == '0') {
        setIsShow(isShow);
      }
      if (obj.delete == '0') {
        setIsdel(isdelete);
      }
      })
  };
  const fetch_org_Data = () => {
    fetch("/orgs", {
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
          obj['label'] = fruits[i]['org_name'];
          arr.push(obj);
        }

        // console.log(arr);
        setOrgzData(arr);
      })
  };
  // Changing state value when searching name
  useEffect(() => {
    if (onSearchText !== "") {
      const filteredObject = data.filter((item) => {
        // return item.folder_name.toLowerCase().includes(onSearchText.toLowerCase());
        if (item.id===parseInt(onSearchText))
        {
          console.log("search "+onSearchText);
          return true;
        }
        else if (item.folder_name.toLowerCase().includes(onSearchText.toLowerCase())){
          return item.folder_name.toLowerCase().includes(onSearchText.toLowerCase());
        }
        else if (item.cabinet_name.toLowerCase().includes(onSearchText.toLowerCase())){
          return item.cabinet_name.toLowerCase().includes(onSearchText.toLowerCase());
        }
        else if (item.org_name.toLowerCase().includes(onSearchText.toLowerCase())){
          return item.org_name.toLowerCase().includes(onSearchText.toLowerCase());

        }
        else if (item.created_at.toLowerCase().includes(onSearchText.toLowerCase())){
          return item.created_at.toLowerCase().includes(onSearchText.toLowerCase());

        }
        

      });
      setData([...filteredObject]);
    } else {
      // setData([...productData]);
      // fetch_Cabinets_Data();
      fetchAllCabinetsData();
      fetch_org_Data();
      

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

  // function to close the form modal
  const onFormCancel = () => {
    setView({ edit: false, add: false, details: false });
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: "",
      category: [],
      sku: [],
    });
    reset({});
  };

  const onCategoryskuChange = (value) => {
    console.log(value.value)
    var requestOptions = {
      method: 'GET',
      redirect: 'follow'
    };

    fetch("/orgcab/" + value.value + "", requestOptions)
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
          obj['label'] = fruits[i]['cabinet_name'];
          arr.push(obj);
        }

        console.log(arr);
        setCabinetData(arr);
      })
      .catch(error => console.log('error', error));


    setFormData({ ...formData, sku: value });
  };

  const onFormSubmit = (form) => {
    const { title, price, sku, stock } = form;
    let submittedData = {
      id: data.length + 1,
      name: title,
      caninet: formData.category,

    };

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var canbinet_id = Object.values(formData.category);
    var org_id = Object.values(formData.sku);
    var today = new Date();
    let inserted = {
      "folder_name": title,
      "cabinet_id": canbinet_id[0],
      "org_id": org_id[0],
      "created_at": today,
      "created_by": "1"
    };
    console.log(inserted);
    var raw = JSON.stringify(inserted);

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    fetch("/folder", requestOptions)
      .then(response => {
        console.log(response.status);
        response.json();
      })
      .then((result) => {
        console.log(result);
        fetchAllCabinetsData();
      })
      .catch(error => console.log('error', error));

    // setData([submittedData, ...data]);
    setView({ open: false });
    setFiles([]);
    resetForm();
  };

  const onEditSubmit1 = () => {
    let submittedData;
    let newItems = data;
    let index = newItems.findIndex((item) => item.id === editId);

    newItems.forEach((item) => {
      if (item.id === editId) {
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

  const onEditSubmit = () => {
    console.log(editId);
    console.log(editOrgId);
    console.log(editCabId);
    console.log(formData.name);

    if (formData.name != "") {

      Swal.fire({
        title: 'Are you sure to Update?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, update it!'
      }).then((result) => {
        if (result.isConfirmed) {
          var myHeaders = new Headers();
          myHeaders.append("Content-Type", "application/json");

          var raw = JSON.stringify({
            "id": editId,
            "folder_name": formData.name,
            "cabinet_id": editCabId,
            "org_id": editOrgId,
            "created_at": "2022-06-22",
            "created_by": "1"
          });

          var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
          };

          fetch("/folder", requestOptions)
            .then(response => {
              console.log(response.status);

              if (response.status == 201) {
                fetchAllCabinetsData();
                Swal.fire(
                  'Update!',
                  'Your Record has been Updated.',
                  'success'
                )
              }
              else {
                Swal.fire({
                  icon: 'error',
                  title: 'Oops...',
                  text: 'Record not update!'

                })
              }
            })
            .then(result => {
              console.log(result)


              resetForm();
              setView({ edit: false, add: false });
            })
            .catch(error => console.log('error', error));

        }
      })

    }
    else {
      Swal.fire(
        'Field is empty?',
        'Please fill field value'
      )

    }

    let submittedData;
    // let newItems = data;
    // let index = newItems.findIndex((item) => item.id === editId);

    // newItems.forEach((item) => {
    //     if (item.id === editId) {
    //         submittedData = {
    //             id: editId,
    //             name: formData.name,

    //         };
    //     }
    // });
    // newItems[index] = submittedData;
    // //setData(newItems);

  };

  // function that loads the want to editted data
  // const onEditClick = (id) => {
  //   data.forEach((item) => {
  //     if (item.id === id) {
  //       setFormData({
  //         name: item.name,
  //         sku: item.sku,
  //         category: item.category

  //       });

  //     }
  //   });
  //   setEditedId(id);
  //   setFiles([]);
  //   setView({ add: false, edit: true });
  // };
  const onEditClick = (id) => {
    console.log(id);
    if (id != "") {
      var requestOptions = {
        method: 'GET',
        redirect: 'follow'
      };

      fetch("/folder/" + id + "", requestOptions)
        .then(response => response.text())
        .then(result => {
          var res = JSON.parse(result);
          console.log(res.folder_name)
          var folder_name = res.folder_name;
          setEditedOrgId(res.org_id);
          setEditedCabId(res.cabinet_id);
          setFormData({
            name: folder_name,
            category: [],
            sku: []

          });
        })

        .catch(error => console.log('error', error));
    }

    setEditedId(id);
    setFiles([]);
    setView({ add: false, edit: true });
  };

  // selects all the products
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
    let index = newData.findIndex((item) => item.id === id);
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
    
        fetch("/folder/" + id + "", requestOptions)
          .then(response => response.text())
          .then((result) => {
            console.log(result);
            fetchAllCabinetsData();
          })
          .catch(error => console.log('error', error));

      }
    });
    console.log(id);
   
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
              <BlockTitle>Units</BlockTitle>
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
                    {/* <li>
                      <UncontrolledDropdown>
                        <DropdownToggle
                          color="transparent"
                          className="dropdown-toggle dropdown-indicator btn btn-outline-light btn-white"
                        >
                          Status
                        </DropdownToggle>
                        <DropdownMenu right>
                          <ul className="link-list-opt no-bdr">
                            <li>
                              <DropdownItem tag="a" href="#dropdownitem" onClick={(ev) => ev.preventDefault()}>
                                <span>New Items</span>
                              </DropdownItem>
                            </li>
                            <li>
                              <DropdownItem tag="a" href="#dropdownitem" onClick={(ev) => ev.preventDefault()}>
                                <span>Featured</span>
                              </DropdownItem>
                            </li>
                            <li>
                              <DropdownItem tag="a" href="#dropdownitem" onClick={(ev) => ev.preventDefault()}>
                                <span>Out of Stock</span>
                              </DropdownItem>
                            </li>
                          </ul>
                        </DropdownMenu>
                      </UncontrolledDropdown>
                    </li> */}
                    <li className="nk-block-tools-opt">
                      {isShow && <>
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
                          <span>Add  Units</span>
                        </Button>
                      </>}
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
                    <DataTableRow className="sm">
                      <span>S.No</span>

                    </DataTableRow>
                    <DataTableRow size="sm">
                      <span>Unit Name</span>
                    </DataTableRow>
                    <DataTableRow size="sm">
                      <span>Organization Name</span>
                    </DataTableRow>
                    <DataTableRow size="sm">
                      <span>Department Name</span>
                    </DataTableRow>
                    <DataTableRow>
                      <span>Created TIme</span>
                    </DataTableRow>
                    {isdelete && <>
                    </>}
                    <DataTableRow className="nk-tb-col-tools">
                      <span>Action</span>

                    </DataTableRow>
                  </DataTableHead>
                  {currentItems.length > 0
                    ? currentItems.map((item) => {
                      return (
                        <DataTableItem key={item.id}>
                          <DataTableRow className="nk-tb-col-check">
                            <span className="tb-sub">{item.id}</span>

                          </DataTableRow>
                          <DataTableRow size="sm">
                            <span className="tb-product">
                              <span className="title">{item.folder_name}</span>
                            </span>
                          </DataTableRow>
                          <DataTableRow>
                            <span className="tb-sub">{item.org_name}</span>
                          </DataTableRow>
                          <DataTableRow>
                            <span className="tb-sub">{item.cabinet_name}</span>
                          </DataTableRow>
                          <DataTableRow>
                            <span className="tb-sub">{item.created_at}</span>
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
                                      <li>
                                        <DropdownItem
                                          tag="a"
                                          href="#edit"
                                          onClick={(ev) => {
                                            ev.preventDefault();
                                            onEditClick(item.id);
                                            toggle("edit");
                                          }}
                                        >
                                          <Icon name="edit"></Icon>
                                          <span>Edit Unit</span>
                                        </DropdownItem>
                                      </li>
                                      {/* <li>
                                          <DropdownItem
                                            tag="a"
                                            href="#view"
                                            onClick={(ev) => {
                                              ev.preventDefault();
                                              onEditClick(item.id);
                                              toggle("details");
                                            }}
                                          >
                                            <Icon name="eye"></Icon>
                                            <span>View Product</span>
                                          </DropdownItem>
                                        </li> */}
                                      <li>
                                        {isdelete && <>
                                          <DropdownItem
                                            tag="a"
                                            href="#remove"
                                            onClick={(ev) => {
                                              ev.preventDefault();
                                              deleteProduct(item.id);
                                            }}
                                          >
                                            <Icon name="trash"></Icon>
                                            <span>Remove Unit</span>
                                          </DropdownItem>
                                        </>}
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
                      <span className="text-silent">No Units found</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </Block>

        <Modal isOpen={view.edit} toggle={() => onFormCancel()} className="modal-dialog-centered" size="lg">
          <ModalBody>
            <a href="#cancel" className="close">
              {" "}
              <Icon
                name="cross-sm"
                onClick={(ev) => {
                  ev.preventDefault();
                  onFormCancel();
                }}
              ></Icon>
            </a>
            <div className="p-2">
              <h5 className="title">Update Unit Name</h5>
              <div className="mt-4">
                <form noValidate onSubmit={handleSubmit(onEditSubmit)}>
                  <Row className="g-3">
                    <Col size="12">
                      <div className="form-group">
                        <label className="form-label" htmlFor="product-title">
                        Unit Name
                        </label>
                        <div className="form-control-wrap">
                          <input
                            type="text"
                            className="form-control"
                            name="name"
                            onChange={(e) => onInputChange(e)}
                            ref={register({
                              required: "This field is required",
                            })}
                            defaultValue={formData.name}
                          />
                          {errors.title && <span className="invalid">{errors.title.message}</span>}
                        </div>
                      </div>
                    </Col>


                    <Col size="12">
                      <Button color="primary" type="submit">
                        <Icon className="plus"></Icon>
                        <span>Update Unit</span>
                      </Button>
                    </Col>
                  </Row>
                </form>
              </div>
            </div>
          </ModalBody>
        </Modal>

        {/* <Modal isOpen={view.details} toggle={() => onFormCancel()} className="modal-dialog-centered" size="lg">
          <ModalBody>
            <a href="#cancel" className="close">
              {" "}
              <Icon
                name="cross-sm"
                onClick={(ev) => {
                  ev.preventDefault();
                  onFormCancel();
                }}
              ></Icon>
            </a>
            <div className="nk-modal-head">
              <h4 className="nk-modal-title title">
                Product <small className="text-primary">#{formData.sku}</small>
              </h4>
              <img src={formData.img} alt="" />
            </div>
            <div className="nk-tnx-details mt-sm-3">
              <Row className="gy-3">
                <Col lg={6}>
                  <span className="sub-text">Product Name</span>
                  <span className="caption-text">{formData.name}</span>
                </Col>
                <Col lg={6}>
                  <span className="sub-text">Product Price</span>
                  <span className="caption-text">$ {formData.price}</span>
                </Col>
                <Col lg={6}>
                  <span className="sub-text">Product Category</span>
                  <span className="caption-text">
                    {formData.category.map((item, index) => (
                      <Badge key={index} className="mr-1" color="secondary">
                        {item.value}
                      </Badge>
                    ))}
                  </span>
                </Col>
                <Col lg={6}>
                  <span className="sub-text">Stock</span>
                  <span className="caption-text"> {formData.stock}</span>
                </Col>
              </Row>
            </div>
          </ModalBody>
        </Modal> */}

        <SimpleBar
          className={`nk-add-product toggle-slide toggle-slide-right toggle-screen-any ${view.add ? "content-active" : ""
            }`}
        >
          <BlockHead>
            <BlockHeadContent>
              <BlockTitle tag="h5">Add  Units</BlockTitle>

            </BlockHeadContent>
          </BlockHead>
          <Block>
            <form onSubmit={handleSubmit(onFormSubmit)}>
              <Row className="g-3">
                <Col size="12">
                  <div className="form-group">
                    <label className="form-label" htmlFor="product-title">
                    Unit Name
                    </label>
                    <div className="form-control-wrap">
                      <input
                        type="text"
                        className="form-control"
                        name="title"
                        onChange={(e) => onInputChange(e)}
                        ref={register({
                          required: "This field is required",
                        })}
                        defaultValue={formData.name}
                      />
                      {errors.title && <span className="invalid">{errors.title.message}</span>}
                    </div>
                  </div>
                </Col>
                <Col md="12">
                  <div className="form-group">
                    <label className="form-label" htmlFor="SKU">
                      Organization
                    </label>
                    <div className="form-control-wrap">

                      <RSelect
                        options={orga}
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
                    <label className="form-label" htmlFor="category">
                      Departments
                    </label>
                    <div className="form-control-wrap">
                      <RSelect
                        // isMulti
                        options={cabinets}
                        defaultValue={formData.category.value}
                        onChange={onCategoryChange}
                        ref={register({ required: "This is required" })}
                      />
                      {errors.category && <span className="invalid">{errors.category.message}</span>}
                    </div>
                  </div>
                </Col>


                <Col size="12">
                  <Button color="primary" type="submit">
                    <Icon className="plus"></Icon>
                    <span>Add  Units</span>
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

export default FolderList;
