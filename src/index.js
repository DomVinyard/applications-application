import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import local from "local-storage";
import HW from "react-highlight-words";
import { Avatar, Button, CardActions, CardHeader } from "@material-ui/core";
import { Grid, Input, Paper, Toolbar } from "@material-ui/core";

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

  // Business logic. Move an item between columns, index addressable
  const Move = (iCol, iItem, direction) => {
    const newData = [...data];
    newData[iCol + direction].push(newData[iCol].splice(iItem, 1)[0]);
    setData(newData);
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
        {iCol > 0 && <Arrow onClick={() => Move(iCol, i, -1)} children="👈" />}
        {iCol < 2 && <Arrow onClick={() => Move(iCol, i, 1)} children="👉" />}
      </CardActions>
    </Paper>
  );

  // And this is the app. The header, error message, and the applications grid
  if (!data) return <div>loading</div>;
  const Action = props => <Button variant="contained" {...props} />;
  return (
    <div style={{ maxWidth: 800, margin: "0 auto" }}>
      <Toolbar style={{ width: 400, margin: "0 auto" }}>
        <Input placeholder="🔍 Search" onKeyUp={Search} />
        <Action onClick={AddPerson} children="🙋 Add" disabled={adding} />
        <Action onClick={FlushData} children="💣 Clear" />
      </Toolbar>
      {error && <div style={{ color: "firebrick" }}>{error}</div>}
      <Grid container spacing={16} direction="row">
        {data.map((column, iCol) => (
          <Grid item xs={4} key={iCol} spacing={8} container direction="column">
            <h3 align="center">{["Applied", "Interviewing", "Hired"][iCol]}</h3>
            {!column.filter(Find).length && <div align="center">none</div>}
            {column.map(
              (item, i) => Find(item) && <Person {...item} iCol={iCol} i={i} />
            )}
          </Grid>
        ))}
      </Grid>
    </div>
  );
};
ReactDOM.render(<CrewApplications />, document.getElementById("root"));