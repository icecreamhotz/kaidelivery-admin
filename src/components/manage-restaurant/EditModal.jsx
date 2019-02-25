import React from "react";
import {
  Row,
  Col,
  Modal,
  Form,
  Input,
  Checkbox,
  TimePicker,
  Select
} from "antd";
import { withGoogleMap, GoogleMap, Marker } from "react-google-maps";
import scriptLoader from "react-async-script-loader";
import TelePhoneInput from "./TelephoneInput";
import moment from "moment";

const { Option } = Select;

const {
  StandaloneSearchBox
} = require("react-google-maps/lib/components/places/StandaloneSearchBox");
const _ = require("lodash");

const MapWithAMarker = withGoogleMap(props => (
  <GoogleMap
    ref={props.onMapLoad}
    defaultZoom={17}
    center={{ lat: props.center.lat, lng: props.center.lng }}
    onClick={props.onMapClick}
    onDragEnd={props.onDragEnd}
    onBoundsChanged={props.onBoundsChanged}
    defaultOptions={{
      streetViewControl: false,
      scaleControl: false,
      mapTypeControl: false,
      panControl: false,
      rotateControl: false,
      fullscreenControl: false
    }}
    disableDefaultUI
  >
    <Marker position={{ lat: props.center.lat, lng: props.center.lng }} />
    {props.loading && (
      <div className="loading-google">
        <div className="loading-google-spin" />
      </div>
    )}
  </GoogleMap>
));

const EditModal = Form.create({ name: "edit_form" })(
  // eslint-disable-next-line
  class extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        resTypes: props.restypes,
        loading: false,
        fileimg: null,
        preview: "",
        altimg: "",
        center: {
          lat: parseFloat(props.restaurant[0].res_lat),
          lng: parseFloat(props.restaurant[0].res_lng),
          errorLatLng: true
        },
        loadingMap: false,
        inputLoading: false,
        searchValue: "",
        bounds: null,
        isSearch: false
      };
    }

    componentDidMount() {
      this.mounted = true;
    }

    componentWillUnmount() {
      this.mounted = false;
    }

    onMapMounted = map => {
      this._map = map;
    };

    onSearchBoxMounted = searchBox => {
      this._searchBox = searchBox;
    };

    onDragMap = () => {
      this.setState(
        prevState => ({
          center: {
            ...prevState.center,
            lat: parseFloat(this._map.getCenter().lat()),
            lng: parseFloat(this._map.getCenter().lng())
          }
        }),
        () =>
          this.setValueToPlaceSearch(
            this.state.center.lat,
            this.state.center.lng
          )
      );
    };

    onMapClick = e => {
      this.setState({ loadingMap: true });
      this.setState(
        prevState => ({
          center: {
            ...prevState.center,
            lat: parseFloat(e.latLng.lat()),
            lng: parseFloat(e.latLng.lng())
          }
        }),
        () =>
          this.setValueToPlaceSearch(
            this.state.center.lat,
            this.state.center.lng
          )
      );
    };

    getGeoLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          position => {
            this.setState(
              prevState => ({
                center: {
                  ...prevState.center,
                  lat: parseFloat(position.coords.latitude),
                  lng: parseFloat(position.coords.longitude),
                  errorLatLng: false
                }
              }),
              () => {
                if (this.isSearch) {
                  this.onClickGetLocation();
                } else {
                  this.setState(prevState => ({ isSearch: true }));
                  this.setValueToPlaceSearch(
                    this.state.center.lat,
                    this.state.center.lng
                  );
                }
              }
            );
          },
          error => console.log(error)
        );
      }
    };

    onBoundsChanged = () =>
      _.debounce(
        () => {
          if (this.mounted) {
            this.setState(prevState => ({
              bounds: this._map.getBounds(),
              center: {
                ...prevState.center,
                lat: parseFloat(this._map.getCenter().lat()),
                lng: parseFloat(this._map.getCenter().lng())
              }
            }));
            let { onBoundsChange } = this.props;
            if (onBoundsChange) {
              onBoundsChange(this._map);
            }
          }
        },
        100,
        {
          maxWait: 300
        }
      );

    setValueToPlaceSearch = (lat, lng) => {
      if (
        !this.state.loadingMap ||
        !this.state.inputLoading ||
        this.state.searchValue !== ""
      ) {
        this.setState({
          loadingMap: true,
          inputLoading: true,
          searchValue: ""
        });
      }
      try {
        const geocoder = new window.google.maps.Geocoder();
        const latlng = { lat: lat, lng: lng };

        geocoder.geocode({ location: latlng }, (results, status) => {
          if (status === window.google.maps.GeocoderStatus.OK) {
            if (results[1]) {
              const request = {
                location: latlng,
                radius: 10,
                type: ["restaurant"]
              };
              if (this._map) {
                const service = new window.google.maps.places.PlacesService(
                  this._map.context.__SECRET_MAP_DO_NOT_USE_OR_YOU_WILL_BE_FIRED
                );
                service.nearbySearch(request, (place, status) => {
                  if (
                    status === window.google.maps.places.PlacesServiceStatus.OK
                  ) {
                    const myRestaurant = `${place[0].name} ${
                      place[0].vicinity
                    }`;
                    this.setState({
                      searchValue: myRestaurant,
                      loadingMap: false,
                      inputLoading: false
                    });
                  } else {
                    this.setState({
                      searchValue: results[1].formatted_address,
                      loadingMap: false,
                      inputLoading: false
                    });
                  }
                });
              } else {
                this.getGeoLocation();
              }
            }
          } else {
            this.setState({
              loadingMap: false,
              inputLoading: false
            });
          }
        });
      } catch (e) {
        this.forceUpdate();
      }
    };

    onPlacesChanged = () => {
      const places = this._searchBox.getPlaces();

      if (places[0]) {
        const nameRestaurant = `${places[0].name} ${
          places[0].formatted_address
        }`;
        this.setState(prevState => ({
          center: {
            ...prevState.center,
            lat: parseFloat(places[0].geometry.location.lat()),
            lng: parseFloat(places[0].geometry.location.lng())
          },
          searchValue: nameRestaurant
        }));
      }
    };

    onChangeSearchBox = e => {
      this.setState({
        searchValue: e.target.value
      });
    };

    handleImageChange = e => {
      const reader = new FileReader();
      const file = e.target.files[0];

      reader.onloadend = () => {
        this.setState({
          fileimg: file,
          preview: reader.result,
          altimg: file.name
        });
      };
      this.imageInput.value = "";
      reader.readAsDataURL(file);
    };

    redoImage = () => {
      this.setState({
        fileimg: null,
        preview: "",
        altimg: ""
      });
    };

    validateTelephone = (rule, value, callback) => {
      if (
        (value.telephone_one.length === 10 &&
          value.telephone_two.length === 0) ||
        (value.telephone_one.length === 10 &&
          value.telephone_two.length === 10) ||
        (value.telephone_one.length === 0 && value.telephone_two.length === 10)
      ) {
        callback();
        return;
      }
      callback("Telephone numbers require 10 digits and number only");
    };

    handleSubmit = () => {
      const { fileimg, center } = this.state;
      this.props.onCreate(fileimg, center, "edit");
      this.setState({
        fileimg: null,
        altimg: "",
        preview: ""
      });
    };

    setChecked = alphabet => {
      const checkAlphabet = this.props.restaurant[0].res_holiday.includes(
        alphabet
      );
      console.log(checkAlphabet);
      return checkAlphabet;
    };

    setTimeToPicker = time => {
      const fakeDate = moment(`2019-02-21 ${time}`, "HH:mm:ss");
      return fakeDate;
    };

    componentWillReceiveProps(nextProps) {
      if (this.props.isScriptLoadSucceed !== nextProps.isScriptLoadSucceed) {
        if (
          this.props.restaurant[0].res_lng &&
          this.props.restaurant[0].res_lat
        ) {
          this.setValueToPlaceSearch(
            this.props.restaurant[0].res_lat,
            this.props.restaurant[0].res_lng
          );
        } else {
          this.getGeoLocation();
        }
      }
    }

    render() {
      const {
        visible,
        onCancel,
        form,
        isScriptLoadSucceed,
        restypes,
        restaurant
      } = this.props;
      const { getFieldDecorator } = form;
      const { preview, altimg } = this.state;

      const previewImage =
        restaurant[0].res_logo !== null && preview === ""
          ? `http://localhost:3000/restaurants/${restaurant[0].res_logo}`
          : preview;

      const altImage =
        restaurant[0].res_logo !== null && preview === ""
          ? `${restaurant[0].res_logo}`
          : altimg;

      const filterTypeName =
        this.props.restaurant[0].restype_id !== null
          ? this.props.restaurant[0].restype_id.map(item => {
              const resTypeName = this.props.restypes.filter(
                types => item === types.restype_id
              );
              return resTypeName[0].restype_name;
            })
          : [];
      return (
        <Modal
          visible={visible}
          title={`${restaurant[0].res_name}`}
          okText="Update"
          onCancel={onCancel}
          onOk={this.handleSubmit}
        >
          <Row>
            <Col span={24}>
              <div className="circle">
                <img
                  className="profile-pic"
                  src={previewImage}
                  alt={altImage}
                />
                <div className="p-image">
                  <i
                    className="fas fa-plus-circle upload-button icon-image"
                    onClick={() => this.imageInput.click()}
                  >
                    <span className="icon-text">Choose Image</span>
                  </i>
                  <input
                    className="file-upload"
                    type="file"
                    accept="image/*"
                    ref={input => (this.imageInput = input)}
                    onChange={e => this.handleImageChange(e)}
                  />
                </div>
                {restaurant[0].res_logo !== null && preview !== "" && (
                  <div className={`p-image undo-image`}>
                    <i
                      className="fas fa-redo upload-button icon-image"
                      onClick={() => this.redoImage()}
                    >
                      <span className="icon-text">Redo Image</span>
                    </i>
                  </div>
                )}
              </div>
            </Col>
          </Row>
          <Form layout="vertical">
            <Row>
              <Col span={24}>
                <Form.Item label="Name">
                  {getFieldDecorator("res_name", {
                    initialValue: restaurant[0].res_name,
                    rules: [
                      {
                        required: true,
                        message: "Please input restaurant name!"
                      }
                    ]
                  })(<Input />)}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Form.Item label="E-mail">
                  {getFieldDecorator("res_email", {
                    initialValue: restaurant[0].res_email,
                    rules: [
                      {
                        type: "email",
                        message: "The input is not valid E-mail!"
                      },
                      {
                        required: true,
                        message: "Please input restaurant email!"
                      }
                    ]
                  })(<Input />)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={6}>
              <Col span={24}>
                <Form.Item label="Telephone" extra="You can add two number.">
                  {getFieldDecorator("telephone", {
                    initialValue: {
                      telephone_one:
                        restaurant[0].res_telephone !== null &&
                        restaurant[0].res_telephone[0]
                          ? restaurant[0].res_telephone[0]
                          : "",
                      telephone_two:
                        restaurant[0].res_telephone !== null &&
                        restaurant[0].res_telephone[1]
                          ? restaurant[0].res_telephone[1]
                          : ""
                    },
                    rules: [
                      {
                        required: true,
                        message: "Please input restaurant name!"
                      },
                      {
                        validator: this.validateTelephone
                      }
                    ]
                  })(<TelePhoneInput />)}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Form.Item label="Address">
                  {getFieldDecorator("res_address", {
                    initialValue: restaurant[0].res_address,
                    rules: [
                      {
                        required: true,
                        message: "Please input restaurant address!"
                      }
                    ]
                  })(<Input.TextArea rows={4} />)}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Form.Item label="Restaurant Details">
                  {getFieldDecorator("res_detail", {
                    initialValue: restaurant[0].res_details,
                    rules: [
                      {
                        required: true,
                        message: "Please input restaurant details!"
                      }
                    ]
                  })(<Input.TextArea rows={2} />)}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Form.Item label="Restaurant Type">
                  {getFieldDecorator("restypes", {
                    initialValue: filterTypeName
                  })(
                    <Select
                      mode="multiple"
                      placeholder="Select your restaurant type"
                    >
                      {restypes.map(item => (
                        <Option key={item.restype_id} value={item.restype_name}>
                          {item.restype_name}
                        </Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={6}>
              <Col span={12}>
                <Form.Item label="Open Time">
                  {getFieldDecorator("res_open", {
                    initialValue: this.setTimeToPicker(restaurant[0].res_open),
                    rules: [
                      {
                        type: "object",
                        required: true,
                        message: "Please select open time!"
                      }
                    ]
                  })(<TimePicker />)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Close Time">
                  {getFieldDecorator("res_close", {
                    initialValue: this.setTimeToPicker(restaurant[0].res_close),
                    rules: [
                      {
                        type: "object",
                        required: true,
                        message: "Please select close time!"
                      }
                    ]
                  })(<TimePicker />)}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Form.Item label="Holiday">
                  {getFieldDecorator("res_holiday", {
                    initialValue: restaurant[0].res_holiday
                  })(
                    <Checkbox.Group style={{ width: "100%" }}>
                      <Row>
                        <Col span={24}>
                          <Checkbox value="จ">Mon</Checkbox>
                        </Col>
                        <Col span={24}>
                          <Checkbox value="อ">Tue</Checkbox>
                        </Col>
                        <Col span={24}>
                          <Checkbox value="พ">Wed</Checkbox>
                        </Col>
                        <Col span={24}>
                          <Checkbox value="พฤ">Thru</Checkbox>
                        </Col>
                        <Col span={24}>
                          <Checkbox value="ศ">Fri</Checkbox>
                        </Col>
                        <Col span={24}>
                          <Checkbox value="ส">Sat</Checkbox>
                        </Col>
                        <Col span={24}>
                          <Checkbox value="อา">Sun</Checkbox>
                        </Col>
                      </Row>
                    </Checkbox.Group>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              {isScriptLoadSucceed && (
                <div data-standalone-searchbox="">
                  <div
                    style={{
                      position: "relative",
                      marginBottom: 10
                    }}
                  >
                    <StandaloneSearchBox
                      ref={this.onSearchBoxMounted}
                      bounds={this.state.bounds}
                      onPlacesChanged={this.onPlacesChanged}
                    >
                      <input
                        type="text"
                        placeholder={
                          this.state.inputLoading
                            ? ""
                            : "Search your restaurant."
                        }
                        style={{
                          boxSizing: `border-box`,
                          border: `1px solid transparent`,
                          width: `100%`,
                          height: `42px`,
                          padding: `0 12px`,
                          borderRadius: `3px`,
                          boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
                          fontSize: `14px`,
                          outline: `none`,
                          textOverflow: `ellipses`
                        }}
                        value={this.state.searchValue}
                        onChange={this.onChangeSearchBox}
                      />
                    </StandaloneSearchBox>
                    <button
                      type="button"
                      style={{
                        position: "absolute",
                        background: "transparent",
                        right: 15,
                        top: 4,
                        border: "none",
                        height: 30,
                        width: 30,
                        outline: "none",
                        textAlign: "center",
                        fontWeight: "bold",
                        padding: 3,
                        cursor: "pointer"
                      }}
                      onClick={this.getGeoLocation}
                    >
                      <i className="fas fa-location-arrow" />
                    </button>
                    {this.state.inputLoading && (
                      <span
                        className="inside-input"
                        style={{
                          position: "absolute",
                          left: 15,
                          top: 4
                        }}
                      />
                    )}
                  </div>
                  <MapWithAMarker
                    loadingElement={<div style={{ height: `100%` }} />}
                    containerElement={
                      <div
                        style={{
                          height: `400px`,
                          display: "flex",
                          flexDirection: "column-reverse",
                          position: "relative"
                        }}
                      />
                    }
                    onBoundsChanged={this.onBoundsChanged}
                    mapElement={<div style={{ height: `100%` }} />}
                    onMapLoad={this.onMapMounted}
                    center={this.state.center}
                    onMapClick={this.onMapClick}
                    onDragEnd={this.onDragMap}
                    loading={this.state.loadingMap}
                  />
                </div>
              )}
            </Row>
          </Form>
        </Modal>
      );
    }
  }
);

export default scriptLoader(
  "https://maps.googleapis.com/maps/api/js?key=AIzaSyDCkgDceoiSbeWa29pNeJxmsNipUF7P3uw&v=3.exp&libraries=geometry,drawing,places"
)(EditModal);
