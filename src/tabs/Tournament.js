import React, {useEffect, useState} from 'react'
import {Button, Group, Header, Search, Separator} from "@vkontakte/vkui";
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
import Cell from "@vkontakte/vkui/dist/components/Cell/Cell";
import Caption from "@vkontakte/vkui/dist/components/Typography/Caption/Caption";

const Tournament = ({fetchedUser, go, tournamentSelect}) => {
    const [loading, setLoading] = useState(false)

    const [myTournaments, setMyTournaments] = useState(Data.getLoadTournaments(4))
    const [myTournamentsLoading, setMyTournamentsLoading] = useState(true)

    const [participateTournaments, setParticipateTournaments] = useState(Data.getLoadTournaments(4))
    const [participateTournamentsLoading, setParticipateTournamentsLoading] = useState(true)

    const [recommendedTournaments, setRecommendedTournaments] = useState(Data.getLoadTournaments(4))
    const [recommendedTournamentsLoading, setRecommendedTournamentsLoading] = useState(true)

    const [highlyRecommendedTournaments, setHighlyRecommendedTournaments] = useState(Data.getLoadTournaments(4))
    const [highlyRecommendedTournamentsLoading, setHighlyRecommendedTournamentsLoading] = useState(true)

    const [activeModal, setActiveModal] = useState(null)

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

        if (recommendedTournamentsLoading) {
            Data.getRecommendedTournaments(fetchedUser)
                .then(tournaments => {
                    setTimeout(() => {
                        setRecommendedTournaments(tournaments)
                    }, 0)
                    setRecommendedTournamentsLoading(false)
                })
        }

        if (highlyRecommendedTournamentsLoading) {
            Data.getHighlyRecommendedTournaments(fetchedUser)
                .then(tournaments => {
                    setTimeout(() => {
                        setHighlyRecommendedTournaments(tournaments)
                    }, 0)
                    setHighlyRecommendedTournamentsLoading(false)
                })
        }
    }

    const closeModal = () => {
        setActiveModal(null)
    }

    const outModal = (props) => {
        closeModal();
    }

    const createTournament = (props) => {

        closeModal()
    }

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

    return <React.Fragment>
        <ModalRoot activeModal={activeModal}>
            <CreateTournament id={Constants.Modals.TOURNAMENT_CREATE_TOURNAMENT}
                out={outModal}
                onClose={closeModal}
                create={createTournament}/>
        </ModalRoot>
        <Search icon={<Icon24VoiceOutline/>}/>
        <Separator/>

        {!loading && fetchedUser ? loadAll() : null}

        <Group separator={"hide"} style={{height: 160}}
            header={<Header aside={
                // <Icon24Add style={{color : Constants.Colors.Dark.CONTEXT_BUTTON}}
                //           onClick={() => {!participateTournaments.length ?
                //               setParticipateTournaments(Data.getLoadTournaments(4)):
                //               setParticipateTournaments([])}}
                // />
                //For test
                <Button  mode="tertiary" onClick={hide}>Hide</Button>
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
                                                tournamentSelect(tournament.id)
                                                go(e)}
                                        }}
                                        data-to = {Constants.Panels.TOURNAMENT_INFO}>
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
                                         tournamentSelect(tournament.id)
                                         go(e)}
                                 }}
                                 data-to = {Constants.Panels.TOURNAMENT_INFO}>
                                <ImageCard url={tournament.imgUrl}
                                           height={60}
                                           width={90}/>
                            </span>})}

            </Div>

        </Group> : null}

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
                bullets={'dark'}
            >
                {highlyRecommendedTournaments.map((t) => {
                    return <Div key={t.id} style={{backgroundImage : `url(${t.imgUrl})`,
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "cover"}}>

                    </Div>})
                }
            </Gallery>
        </Group>

        <Group separator={'hide'}
               style={{position : "relative", zIndex : 0}}>
                {recommendedTournaments.map((tournament) =>
                    <SimpleCell
                        before={<Avatar mode="app" src={tournament.imgUrl} size={72}/>}
                        description={
                            <React.Fragment>
                                <Caption level="2" weight="regular" >Игра: {tournament.gameName}Игра: {tournament.gameName}Игра: {tournament.gameName}Игра: {tournament.gameName}Игра: {tournament.gameName}</Caption>
                                <Caption level="2" weight="regular">Тип сетки: {tournament.type}</Caption>
                                <Caption level="2" weight="regular">Начало: {tournament.date}</Caption>
                            </React.Fragment>
                        }>{tournament.name}</SimpleCell>)}

        </Group>
    </React.Fragment>
}

export default Tournament