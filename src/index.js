import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import local from "local-storage";
import HW from "react-highlight-words";
import { Avatar, Button, CardActions, CardHeader } from "@material-ui/core";
import { Grid, Input, Paper, Toolbar } from "@material-ui/core";
import styled from 'styled-components'
import Move from './function.move'

// 90POE Applications application
const CrewApplications = () => {
  const random = num => `https://randomuser.me/api/?nat=gb&results=${num}`;
  const users = async num => (await (await fetch(random(num))).json()).results;
  const [data, setData] = useState([[], [], []]);
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");

  // get initial data from local storage, otherwise from randomUser.me
  useEffect(async () => {
    const existingData = local.get("data");
    if (existingData) return setData(existingData);
    try {
      await setData([await users(5), [], []]);
    } catch (error) {
      setError("Error fetching users");
    }
  }, []);

  // Every time the data changes, persist it to local storage
  useEffect(async () => local.set("data", data), [data]);

  // Let's include a method for adding a new person.
  const [adding, setAdding] = useState(false);
  const AddPerson = async () => {
    await setAdding(true); // ('add' button spam protection)
    try {
      const updatedData = [...data];
      updatedData[0].push((await users(1))[0]);
      setData(updatedData);
    } catch (error) {
      setError("Error fetching users");
    }
    await setAdding(false);
  };
  const FlushData = () => setData([[], [], []]); // And a way to clear data.

  // Instead of filters we'll do a string search
  const Search = e => setQuery(e.target.value);
  const Find = ({ name: { first, last }, location: { city } }) => {
    const check = key => key.indexOf(query.toLowerCase()) > -1;
    return [first, last, city].some(check);
  };

  // This is an individual Person Card with left and right buttons
  const Text = ({ val }) => <HW searchWords={[query]} textToHighlight={val} />;
  const Arrow = props => <Button fullWidth {...props} />;
  const Person = ({ iCol, i, name, location: { city }, picture }) => (
    <Paper elevation={1} style={{ marginBottom: 4 }} key={i}>
      <CardHeader
        avatar={<Avatar src={picture.thumbnail} />}
        title={<Text val={`${name.first} ${name.last}`} />}
        subheader={<Text val={city} />}
      />
      <CardActions disableActionSpacing={true}>
        {iCol > 0 && <Arrow onClick={() => {
          setData(Move({ col: iCol, row: i, direction: -1, data }))
        }} children="👈" />}
        {iCol < 2 && <Arrow onClick={() => {
          setData(Move({ col: iCol, row: i, direction: 1, data }))
        }} children="👉" />}
      </CardActions>
    </Paper>
  );

  // And this is the app. The header, error message, and the applications grid
  if (!data) return <div>loading</div>;
  const columnHeaders = ["applied", "interviewing", "hired"];
  return (
    <div style={{ maxWidth: 800, margin: "0 auto" }}>
      <Toolbar>
        <Input placeholder="🔍 Search" onKeyUp={Search} />
        <AddButton onClick={AddPerson} children="🙋 Add" disabled={adding} />
        <Action onClick={FlushData} children="💣 Clear" />
      </Toolbar>
      {error && <div style={{ color: "firebrick" }}>{error}</div>}
      <Grid container spacing={16} direction="row">
        {data.map((column, iCol) => (
          <Grid item xs={4} key={iCol} spacing={8} container direction="column">
            <Column>
              <ColumnHead>{column.filter(Find).length || ""} {columnHeaders[iCol]}</ColumnHead>
              {!column.filter(Find).length && <NoneWrap><None>NONE</None></NoneWrap>}
              {column.map(
                (item, i) => Find(item) && <Person {...item} iCol={iCol} i={i} />
              )}
            </Column>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

// Styled components

const Column = styled.span`
  background: aliceblue;
  padding: 0.5rem;
  border-radius: 12px;
  font-family: "HelveticaNeue-Light", sans-serif; 
`

const NoneWrap = styled.h2`
  overflow: hidden;
  color: #416d94;
  text-align: center;
  > span{
    position: relative;
    display: inline-block;
  }
  > span:before, > span:after{
    content: '';
    position: absolute;
    top: 50%;
    border-bottom: 2px solid;
    width: 591px; /* half of limiter*/
    margin: 0 20px;
  }
  > span:before{
    right: 100%;
  }
  > span:after{
    left: 100%;
  }
`

const ColumnHead = styled.h2`
  text-align: center;
  color: rgb(122, 136, 148);
  font-weight: 200;
  letter-spacing: 1px;
`

const None = styled.span`
  text-align: center;
  margin-bottom: 1rem;
  font-size: 0.8rem;
  font-weight: bold;
`

// This is not a good way to do this.
const Action = props => <Button variant="contained" {...props} />;
const AddButton = styled(Action)`
  margin-left: auto !important;
  margin-right: 4px !important;
`

// Render
ReactDOM.render(<CrewApplications />, document.getElementById("root"));
