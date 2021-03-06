import React, {useState} from "react";
import PanelHeader from "@vkontakte/vkui/dist/components/PanelHeader/PanelHeader";
import Panel from "@vkontakte/vkui/dist/components/Panel/Panel";
import PanelHeaderBack from "@vkontakte/vkui/dist/components/PanelHeaderBack/PanelHeaderBack";
import Constants from "../Model/Constants";
import {Spinner, Tabs, TabsItem} from "@vkontakte/vkui";
import TournamentInfo from "../tabs/TournamentInfo";
import Grid from "../tabs/Grid";
import Participants from "../tabs/Participants";

const TournamentInfoHome = ({id, tournament, go, fetchedUser}) => {
    const [activeTab, setActiveTab] = useState(Constants.Tabs.TOURNAMENT_INFO)

    const showTab = () => {
        switch (activeTab) {
            case Constants.Tabs.TOURNAMENT_INFO:
                return <TournamentInfo fetchedUser={fetchedUser}
                   go={go}
                   tournament={tournament}/>
            case Constants.Tabs.TOURNAMENT_GRID:
                return <Grid
                    tournament={tournament}/>
            case Constants.Tabs.TOURNAMENT_PARTICIPANTS:
                return <Participants
                    tournament={tournament}
                    fetchedUser={fetchedUser}
                    go={go}/>
        }
        return null
    }

    
    return (<Panel id={id}>
        <PanelHeader left={<PanelHeaderBack onClick={go} data-to={Constants.Panels.HOME}/>}>
            Информация о турнире
        </PanelHeader>
        <Tabs>
            <TabsItem
                id = {Constants.Tabs.TOURNAMENT_INFO}
                onClick={() => {
                    setActiveTab(Constants.Tabs.TOURNAMENT_INFO)}}
                      selected={activeTab === Constants.Tabs.TOURNAMENT_INFO}>
                Информация
            </TabsItem>
            <TabsItem
                id = {Constants.Tabs.TOURNAMENT_GRID}
                onClick={() => setActiveTab(Constants.Tabs.TOURNAMENT_GRID)}
                      selected={activeTab === Constants.Tabs.TOURNAMENT_GRID}>
               Сетка
            </TabsItem>
            <TabsItem id = {Constants.Tabs.TOURNAMENT_PARTICIPANTS}
                onClick={() => setActiveTab(Constants.Tabs.TOURNAMENT_PARTICIPANTS)}
                      selected={activeTab === Constants.Tabs.TOURNAMENT_PARTICIPANTS}>
                Участники
            </TabsItem>
        </Tabs>
        {fetchedUser ? showTab() :
            <Spinner size={"large"} style={{position:"relative", marginTop:"50%"}}/>}
    </Panel>)
}

export default TournamentInfoHome