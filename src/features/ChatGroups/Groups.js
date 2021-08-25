import React, { useState, useEffect } from "react";

import { useMoralis } from "react-moralis";
import { Link, useRouteMatch } from "react-router-dom";
import { MyNFTToken } from "../MyNFTToken/MyNFTToken";
import { MyNFTTokenProxy } from "../MyNFTTokenProxy/MyNFTTokenProxy";

import styles from './Groups.module.css';

function useGroups() {
    const { Moralis } = useMoralis();
    const collection = "ChatGroup";
    const [groups, setGroups] = useState([]);

    const Group = Moralis.Object.extend(collection);

    async function createGroup(attrs) {
        const group = new Group();

        for (let k in attrs) {
            group.set(k, attrs[k]);
        }

        return group.save();
        // .then((group) => {
        //     // Execute any logic that should take place after the object is saved.
        //     console.log('New object created with objectId: ' + group.id);
        // }, (error) => {
        //     // Execute any logic that should take place if the save fails.
        //     // error is a Moralis.Error with an error code and message.
        //     console.log('Failed to create new object, with error code: ' + error.message);
        // });
    }

    async function readGroups() {
        const query = new Moralis.Query(Group);
        const results = await query.find();
        setGroups(results);
        // .then((results) => {
        //     console.log("results", results);
        //     setGroups(results);
        // }).catch((error) => {
        //     console.log("error", error);
        // });
    }

    useEffect(() => {
        // let query = new Moralis.Query(collection);
        // let subscription = await query.subscribe();

        // subscription.on('create', (object) => {
        //     console.log('object created');
        // });

        //   function handleStatusChange(status) {
        //     setIsOnline(status.isOnline);
        //   }

        //   ChatAPI.subscribeToFriendStatus(friendID, handleStatusChange);
        return () => {
            // ChatAPI.unsubscribeFromFriendStatus(friendID, handleStatusChange);
        };
    });

    return { groups, createGroup, readGroups };
}

const Groups = () => {
    let match = useRouteMatch();
    let {isInitialized, user} = useMoralis();
    let [isComponentInitialized, setInitialized] = useState(false);
    const { groups, createGroup, readGroups } = useGroups();
    const [newGroupName, setNewGroupName] = useState("");
    
    console.log("geri match", match);
    if(!isComponentInitialized && isInitialized) {
        setInitialized(!isComponentInitialized);
        readGroups();
    }

    const onCreateGroup = async (event) => {
        await createGroup({ name: newGroupName });
        readGroups();
    }

    const onNameChange = (event) => {
        setNewGroupName(event.target.value);
    }

    const onMintToken = async () => {
        const myNFTToken = new MyNFTToken();
        await myNFTToken.init();
        console.log("geri user", user);
        // const ethAddress = user.get("ethAddress");
        const ethAddress = "0x211773eA847a59Ca889424a52835D24F8fdb79B2";
        console.log("geri ethAddress", ethAddress);
        console.log("geri name", await myNFTToken.name());
        console.log("geri symbol", await myNFTToken.symbol());
        console.log("geri nextTokenId", await myNFTToken.nextTokenId());
        try { 
            await myNFTToken.mint(ethAddress);
        } catch(error) {
            console.error(error);
        }
    }

    const onUpgradeToken = async () => {
        const myNFTTokenProxy = new MyNFTTokenProxy();
        await myNFTTokenProxy.init();
        console.log("geri user", user);
        // const ethAddress = user.get("ethAddress");
        const ethAddress = "0x211773eA847a59Ca889424a52835D24F8fdb79B2";
        console.log("geri ethAddress", ethAddress);
        console.log("geri name", await myNFTTokenProxy.name());
        console.log("geri symbol", await myNFTTokenProxy.symbol());
        try { 
            await myNFTTokenProxy.upgrade(ethAddress);
        } catch(error) {
            console.error(error);
        }
    }

    const groupList = groups.map((group, idx) => {
        return <li key={idx}><Link to={`${match.url}${group.id}`}>{group.get("name")}</Link></li>
    })

    return (
        <div className={styles.widget}>
            <input name="group-name" type="text" onChange={onNameChange} />
            <button onClick={onCreateGroup}>Create Group</button>
            <ul className={styles.channelsList}>{groupList}</ul>
            {/* <button onClick={onMintToken}>Mint NFT Token</button>
            <button onClick={onUpgradeToken}>Upgrade</button> */}
        </div>
    );
};

export default Groups;
