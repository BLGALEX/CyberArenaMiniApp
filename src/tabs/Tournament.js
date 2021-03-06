import React, {useEffect, useState} from 'react'
import {Button, Group, Header, Search, Separator, Spinner} from "@vkontakte/vkui";
import Icon24Add from '@vkontakte/icons/dist/24/add';
import Title from "@vkontakte/vkui/dist/components/Typography/Title/Title";
import Icon24VoiceOutline from '@vkontakte/icons/dist/24/voice_outline';
import Constants from "../Model/Constants";
import Data from "../Model/Data";
import ImageCard from "../Componentns/ImageCard";
import TournamentBanner from "../banners/TournamentBanner";
import CreateTournament from "../modals/CreateTournament";
import ModalRoot from "@vkontakte/vkui/dist/components/ModalRoot/ModalRoot";
import Gallery from "@vkontakte/vkui/dist/components/Gallery/Gallery";
import Div from "@vkontakte/vkui/dist/components/Div/Div";
import SimpleCell from "@vkontakte/vkui/dist/components/SimpleCell/SimpleCell";
import Avatar from "@vkontakte/vkui/dist/components/Avatar/Avatar";
import Caption from "@vkontakte/vkui/dist/components/Typography/Caption/Caption";
import "../styles.css"
import Coliseum from "../img/coliseum.png";
import Placeholder from "@vkontakte/vkui/dist/components/Placeholder/Placeholder";

const Tournament = ({fetchedUser, go, selectTournament}) => {
    const [loading, setLoading] = useState(false)

    const [myTournaments, setMyTournaments]
        = useState(Data.getLoadTournaments(4, Constants.TournamentsPreviewSize.MEDIUM))
    const [myTournamentsLoading, setMyTournamentsLoading] = useState(true)

    const [participateTournaments, setParticipateTournaments]
        = useState(Data.getLoadTournaments(4, Constants.TournamentsPreviewSize.MEDIUM))
    const [participateTournamentsLoading, setParticipateTournamentsLoading] = useState(true)

    const [recommendedTournaments, setRecommendedTournaments]
        = useState(Data.getLoadTournaments(8, Constants.TournamentsPreviewSize.SMALL_QUAD))
    const [recommendedTournamentsLoading, setRecommendedTournamentsLoading] = useState(true)

    const [highlyRecommendedTournaments, setHighlyRecommendedTournaments]
        = useState(Data.getLoadTournaments(4, Constants.TournamentsPreviewSize.LARGE))
    const [highlyRecommendedTournamentsLoading, setHighlyRecommendedTournamentsLoading] = useState(true)

    const [activeModal, setActiveModal] = useState(null)

    const [searchValue, setSearchValue] = useState()
    const [searchOnFocus, setSearchOnFocus] = useState(false)
    const [searchValueLoading, setSearchValueLoading] = useState(false)
    const [searchFilterTournaments, setSearchFilterTournaments] = useState()

    useEffect(() => {
        setLoading(false)
    }, [])

    const loadAll = () => {
        if (myTournamentsLoading) {
            Data.getMyTournaments(fetchedUser)
                .then(tournaments => {
                    setTimeout(() => {
                        setMyTournaments(tournaments)
                    }, 0)
                    setMyTournamentsLoading(false)
                })
        }

        if (participateTournamentsLoading) {
            Data.getParticipateTournaments(fetchedUser)
                .then(tournaments => {
                    setTimeout(() => {
                        setParticipateTournaments(tournaments)
                    }, 0)
                    setParticipateTournamentsLoading(false)
                })
        }

        if (highlyRecommendedTournamentsLoading) {
            Data.getHighlyRecommendedTournaments(fetchedUser)
                .then(tournaments => {
                    setTimeout(() => {
                        setHighlyRecommendedTournaments(
                            tournaments.slice(0, Math.min(Constants.NUMBER_OF_HIGHLY_REC_TOURNAMENT, tournaments.length)))
                    }, 0)
                    setHighlyRecommendedTournamentsLoading(false)
                })
        }

        if (recommendedTournamentsLoading) {
            Data.getRecommendedTournaments(fetchedUser)
                .then(tournaments => {
                    setTimeout(() => {
                        setRecommendedTournaments(tournaments)
                        setRecommendedTournamentsLoading(false)
                    }, 0)
                })
        }

    }

    const closeModal = () => {
        setActiveModal(null)
    }

    const outModal = (props) => {
        //TO-DO сделать сохранение в кеш, чтобы при открытии окна подгружались значения
        closeModal()
    }

    const createTournament = (tournament) => {
        //TO-DO отправить на сервер
    }

    // For test
    const hide = () => {
        if (myTournaments.length) {
            setMyTournaments([])
        } else {
            setMyTournamentsLoading(true)
        }

        if (participateTournaments.length) {
            setParticipateTournaments([])
        } else {
            setParticipateTournamentsLoading(true)
        }
    }

    const onSearchChange = (e) => {
        let text = e.target.value
        setSearchValue(text)

        if (!text || text.length === 0) return null
        setSearchValueLoading(true)
        text = text.trim().toLowerCase()
        Data.getAllTournaments(fetchedUser)
            .then(tournaments => {
                tournaments = tournaments.filter((t) =>
                    t.name.toLowerCase().includes(text) || t.description.toLowerCase().includes(text))
                setTimeout(() => {
                    setSearchFilterTournaments(tournaments)
                    setSearchValueLoading(false)
                }, 250)
            })

    }

    return <React.Fragment>
        {!loading ? loadAll() : null}

        <ModalRoot activeModal={activeModal}>
            <CreateTournament id={Constants.Modals.TOURNAMENT_CREATE_TOURNAMENT}
                out={outModal}
                close={closeModal}
                create={createTournament}
                onClose={closeModal}/>
        </ModalRoot>

        <Search icon={!searchValue || !searchValue.length ? <Icon24VoiceOutline/> : null} value={searchValue}
                onChange={onSearchChange}
                onFocus={()=>{setSearchOnFocus(true)}}
                onBlur={()=>{setSearchOnFocus(false)}}/>
        <Separator/>

        {searchValue && searchValue.length > 0 ?
            <Group separator={'hide'}
                                style={{position : "relative", zIndex : 0}}>
                {searchValueLoading ?
                    Data.getLoadTournaments(3, Constants.TournamentsPreviewSize.SMALL_QUAD).map((tournament) =>{
                        return <SimpleCell key={tournament.id}
                            before={<Avatar mode="app" src={tournament.imgUrl} size={72}/>}
                            description={
                                <React.Fragment>
                                    <Caption><Div className={'recommend_place_holder_descr'} style={{marginTop : 6}}/></Caption>
                                    <Caption><Div className={'recommend_place_holder_descr'}/></Caption>
                                    <Caption><Div className={'recommend_place_holder_descr'} style={{marginBottom: 0}}/></Caption>
                                </React.Fragment>
                            }><Div className={'recommend_place_holder_name'}/>
                        </SimpleCell>
                    }) :
                    searchFilterTournaments.length ?
                    searchFilterTournaments.map((tournament) =>{
                        return <SimpleCell key={tournament.id}
                                onClick={(e) => {
                                   selectTournament(tournament)
                                   go(e)
                                }}
                                data-to = {Constants.Panels.TOURNAMENT_INFO_HOME}
                                before={<Avatar mode="app" src={tournament.imgUrl} size={72}/>}
                                description={
                                <React.Fragment>
                                    <Caption level="2" weight="regular" >Игра: {tournament.gameName}</Caption>
                                    <Caption level="2" weight="regular">Тип сетки: {tournament.type}</Caption>
                                    <Caption level="2" weight="regular">Начало: {tournament.dateBegin}</Caption>
                                </React.Fragment>
                            }>{tournament.name}
                        </SimpleCell>
                    }) : <Placeholder
                            icon={<img src={Coliseum} height={"50%"} width={"50%"}/>}
                            header="Ничего не найдено"
                        />}
            </Group>
        : <React.Fragment>

            {/* Список турниров, созданных пользователем */}
            <Group separator={"hide"} style={{height: 160}}
                header={<Header aside={
                    // For test
                    // <Icon24Add style={{color : Constants.Colors.Dark.CONTEXT_BUTTON}}
                    //           onClick={() => {!participateTournaments.length ?
                    //               setParticipateTournaments(Data.getLoadTournaments(4)):
                    //               setParticipateTournaments([])}}
                    // />
                    // For test
                    // <Button  mode="tertiary" onClick={hide}>Hide</Button>
                    <Icon24Add style={{color : Constants.Colors.Dark.CONTEXT_BUTTON}}
                               onClick={() => setActiveModal(Constants.Modals.TOURNAMENT_CREATE_TOURNAMENT)}
                    />
                }>
                    <Title level="3" weight="regular"> Мои турниры</Title>
                </Header>}>

                {(myTournamentsLoading || myTournaments.length) ?
                    <Group>
                        <Div style={{
                            marginTop: 0,
                            overflowX: "auto",
                            whiteSpace: "nowrap",
                            padding: "0 16px"}}>
                            {myTournaments.map((tournament) => {
                                return <span key={tournament.id}
                                            onClick={(e)=>{
                                                if (!myTournamentsLoading) {
                                                    selectTournament(tournament)
                                                    go(e)}
                                            }}
                                            data-to = {Constants.Panels.TOURNAMENT_INFO_HOME}>
                                    <ImageCard url={tournament.imgUrl}
                                               height={90}
                                               width={150}/>
                                </span>})}
                        </Div>
                    </Group>
                    :
                    <Group separator={"hide"} style={{position : "relative", zIndex : 0, top: "-12px"}}>
                        <TournamentBanner
                            buttonPressed={() => setActiveModal(Constants.Modals.TOURNAMENT_CREATE_TOURNAMENT)}/>
                    </Group>
                }
            </Group>

            {/* Список турниров, в которых я участвую */}
            {participateTournamentsLoading || participateTournaments.length ?
            <Group separator={'hide'}
                   style={{position : "relative", zIndex : 0}}
                   header={<Header>
                <Title level="3" weight="regular">Турниры, в которых я участвую</Title>
            </Header>}>
                <Div style={{
                    marginTop: 0,
                    overflowX: "auto",
                    whiteSpace: "nowrap",
                    padding: "0 16px",
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between"
                    }}>
                    {participateTournaments.map((tournament) => {
                        return <span key={tournament.id}
                                     onClick={(e)=>{
                                         if (!participateTournamentsLoading) {
                                             selectTournament(tournament)
                                             go(e)}
                                     }}
                                     data-to = {Constants.Panels.TOURNAMENT_INFO_HOME}>
                                    <ImageCard url={tournament.imgUrl}
                                               height={60}
                                               width={90}/>
                                </span>})}

                </Div>

            </Group> : null}

            {/* Список особо рекомендуемых турниров */}
            <Group
                separator={'hide'}
                header={<Header>
                    <Title level="3" weight="regular">Рекомендуемые турниры</Title>
                    </Header>}
            style={{marginBottom: 30, position : "relative", zIndex : 0}}>
                <Gallery
                    slideWidth="90%"
                    align="center"
                    style={{ height: 180 }}
                    bullets={'light'}
                >
                    {highlyRecommendedTournaments.map((tournament) => {
                        return <Div key={tournament.id}
                            onClick={(e)=>{
                                if (!highlyRecommendedTournamentsLoading) {
                                    selectTournament(tournament)
                                    go(e)
                                }
                            }}
                            data-to = {Constants.Panels.TOURNAMENT_INFO_HOME}
                            style={{backgroundImage : `url(${tournament.imgUrl})`,
                                backgroundPosition: "center",
                                backgroundRepeat: "no-repeat",
                                backgroundSize: "cover"}}>

                        </Div>})
                    }
                </Gallery>
            </Group>

            {/*Бесконечный список турниров*/}
            <Group separator={'hide'}
                   style={{position : "relative", zIndex : 0}}>
                    {recommendedTournaments.map((tournament) => {
                        return (recommendedTournamentsLoading ? <SimpleCell
                            key={tournament.id}
                            before={<Avatar mode="app" src={tournament.imgUrl} size={72}/>}
                            description={
                                <React.Fragment>
                                    <Caption><Div className={'recommend_place_holder_descr'} style={{marginTop : 6}}/></Caption>
                                    <Caption><Div className={'recommend_place_holder_descr'}/></Caption>
                                    <Caption><Div className={'recommend_place_holder_descr'} style={{marginBottom: 0}}/></Caption>
                                </React.Fragment>
                            }><Div className={'recommend_place_holder_name'}/></SimpleCell>
                            :
                            <SimpleCell
                                key={tournament.id}
                                onClick={(e)=>{
                                    selectTournament(tournament)
                                    go(e)
                                }}
                                data-to = {Constants.Panels.TOURNAMENT_INFO_HOME}
                                before={<Avatar mode="app" src={tournament.imgUrl} style={{objectFit : "cover"}} size={72}/>}
                                description={
                                    <React.Fragment>
                                        <Caption level="2" weight="regular">Игра: {tournament.gameName}</Caption>
                                        <Caption level="2" weight="regular">Тип сетки: {tournament.type}</Caption>
                                        <Caption level="2" weight="regular">Начало: {tournament.dateBegin}</Caption>
                                    </React.Fragment>
                                }>{tournament.name}
                            </SimpleCell>)
                    })}
            </Group>
        </React.Fragment>}
    </React.Fragment>
}

export default Tournament