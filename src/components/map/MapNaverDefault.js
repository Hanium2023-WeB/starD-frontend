import React, {useEffect, useRef, useState, useCallback} from 'react';
import axios from "axios";

const MapNaverDefault = ({studyId, Member,progressStatus}) => {

    const accessToken = localStorage.getItem('accessToken');

    const [mapLat, setMapLat] = useState(37.5666103); // 위도
    const [mapLng, setMapLng] = useState(126.9783882); // 경도
    const [currentLocation, setCurrentLocation] = useState({});
    const mapElement = useRef(null);
    const {naver} = window;
    const [inputs, setInputs] = useState(["", ""]);
    const searchResultsRef = useRef(null); //검색결과창
    const [myLocation, setMyLocation] = useState({}); //현재 위치


    //현재 나의 위치 찾기
    const MyLocationpoint = useCallback(() => {
        var options = {
            enableHighAccuracy: true, //정확도 높이기 -> 완전 정확하지 않음
            maximumAge: 30000,
            timeout: 15000
        }

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(success, error, options);
        }
        if (!mapElement.current || !naver) return;
        const location = new naver.maps.LatLng(myLocation.latitude, myLocation.longitude);

        const mapOptions = {
            center: location,
            zoom: 17,
            zoomControl: true,
        };

        const map = new naver.maps.Map(mapElement.current, mapOptions);
        new naver.maps.Marker({
            position: location,
            map,
        });

        // 위치추적에 성공했을때 위치 값을 넣어줌
        function success(position) {
            console.log("위도", position.coords.latitude);
            console.log("경도", position.coords.longitude);
            setMyLocation({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
            });
            const location = new naver.maps.LatLng(position.coords.latitude, position.coords.longitude);

            const reverseGeocodeUrl = `https://naveropenapi.apigw.ntruss.com/map-reversegeocode/v2/gc?coords=${position.coords.longitude},${position.coords.latitude}&orders=addr`;

            axios.get(reverseGeocodeUrl, {
                headers: {
                    'X-NCP-APIGW-API-KEY-ID': process.env.REACT_APP_NAVER_MAPS_CLIENT_ID,
                    'X-NCP-APIGW-API-KEY': process.env.REACT_APP_MAP_NAVER_SECRET
                },
            })
                .then(response => {
                    // Extract the address from the response
                    const address = response.data.addresses[0].addrDetail;
                    console.log('주소:', address);

                    // Create the map with the obtained coordinates
                    const mapOptions = {
                        center: location,
                        zoom: 17,
                        zoomControl: true,
                    };

                    const map = new naver.maps.Map(mapElement.current, mapOptions);

                    // Add a marker to the map
                    new naver.maps.Marker({
                        position: location,
                        map,
                    });
                })
                .catch(error => console.error('Error in reverse geocoding:', error));

        }

        // 위치 추적에 실패 했을때 초기값을 넣어줌
        function error() {
            console.log("error남")
            setMyLocation({latitude: 37.4979517, longitude: 127.0276188});
        }

        return myLocation;

    }, [mapElement, myLocation]);

    // //회원가입 시 입력한 구, 군 위치찍기 -> 위도 경도 초기화
    // useEffect(() => {
    //     axios.get(`/api/location/${studyId}/all`, {
    //         withCredentials: true,
    //         headers: {
    //             'Authorization': `Bearer ${accessToken}`
    //         }
    //     })
    //         .then((res) => {
    //             console.log("Location : ", res.data);
    //
    //             setMapLat(res.data.latitude);
    //             setMapLng(res.data.longitude);
    //         })
    //         .catch((error) => {
    //             console.error("위도, 경도 불러오기 실패", error);
    //         });
    //
    // }, []);

    useEffect(() => {
        if (!mapElement.current || !naver) return;

        if (naver.maps) {
            const location = new naver.maps.LatLng(mapLat, mapLng);

            const mapOptions = {
                center: location,
                zoom: 16,
                zoomControl: true,
            };

            const map = new naver.maps.Map(mapElement.current, mapOptions);
            new naver.maps.Marker({
                position: location,
                map,
            });

        }
    }, [mapLat, mapLng, naver]);

    // 상태가 지리적 위치 정보로 업데이트된 후 지도와 마커 생성처리
    useEffect(() => {
        if (!mapElement.current || !naver || !myLocation.latitude || !myLocation.longitude) return;

        const location = new naver.maps.LatLng(myLocation.latitude, myLocation.longitude);
        const mapOptions = {
            center: location,
            zoom: 17,
            zoomControl: true,
        };

        const map = new naver.maps.Map(mapElement.current, mapOptions);

        new naver.maps.Marker({
            position: location,
            map,
            // 원하는 이미지로 마커 커스텀
            // icon: {
            //     url: pinImage,
            //     size: new naver.maps.Size(50, 52),
            //     origin: new naver.maps.Point(0, 0),
            //     anchor: new naver.maps.Point(25, 26),
            //   },
        });
    }, [mapElement, naver, myLocation]);

    const addInput = () => {
        if (inputs.length === Member.length) {
            alert('스터디 인원을 초과할 수 없습니다.');
            return;
        }
        setInputs([...inputs, ""]);
    };

    const removeInput = (index) => {
        if (inputs.length !== 1) {
            const newInputs = [...inputs];
            newInputs.splice(index, 1);
            setInputs(newInputs);
        }
    };

    const handleInputChange = (index, value) => {
        const newInputs = [...inputs];
        newInputs[index] = value;
        setInputs(newInputs);
    }


    //중간위치 찾아주기
    const findMidpoint = () => {
        if (inputs.some(input => !input.trim())) {
            if(progressStatus === 'DISCONTINUE'){
                alert('중단된 스터디는 중간지점 찾기가 불가능합니다.');
                return;
            }else {
                alert('모든 입력 값을 올바르게 작성하세요.');
                return;
            }
        }

        const params = new URLSearchParams();
        inputs.forEach(place => params.append('places', place));

        axios.get(`/api/studies/${studyId}/locations/find?${params.toString()}`, {
            withCredentials: true,
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })
            .then((res) => {
                console.log("Location : ", res.data);
                setMapLat(res.data.longitude);
                setMapLng(res.data.latitude);
            })
            .catch((error) => {
                console.error("위도, 경도 불러오기 실패", error);
            });
    }

    return (
        <div className={"map_content"}>
            {inputs.map((input, index) => (
                <div>
                    <div key={index} id={"input-location"}>
                        <input placeholder={" 장소를 입력하세요."}
                               onChange={(e) => handleInputChange(index, e.target.value)} disabled={progressStatus === 'DISCONTINUE'}/>
                        {inputs.length - 1 === index && (
                            <button onClick={addInput}>+</button>
                        )}
                        {inputs.length !== 1 && index > 1 && (
                            <button onClick={() => removeInput(index)}>-</button>
                        )}
                    </div>
                    {/*<div id="searchResults">*/}
                    {/*    {items.map((item, index) => (*/}
                    {/*        <div key={index} className="result-item" onClick={() => handleResultItemClick(index)}>*/}
                    {/*            {item.jibunAddress}*/}
                    {/*        </div>*/}
                    {/*    ))}*/}
                    {/*</div>*/}
                </div>
            ))}

            <div ref={searchResultsRef}></div>
            <div className={"find_btn"}>
                <button onClick={findMidpoint}>찾기</button>
                <button onClick={MyLocationpoint}>현재 나의 위치</button>
            </div>
            <div ref={mapElement} style={{height: '250px', width: '580px'}} id={"naver-map"}/>
        </div>
    );
};

export default MapNaverDefault;