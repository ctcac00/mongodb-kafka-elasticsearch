import React from 'react';
import { fade, makeStyles, InputBase, Grid } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider'

import SearchIcon from '@material-ui/icons/Search';
import axios from 'axios';

const useStyles = makeStyles((theme) => ({
  grid: {
    flexGrow: 1,
  },
  card: {
    maxWidth: 345,
    //minHeight: 400,
    //maxHeight: 400,
  },
  media: {
    height: 140,
    paddingTop: '100%', // 16:9
  },
  searchBar: {
    display: 'flex',
    marginBottom: 10,
    justifyContent: 'center',
  },
  released: {
    minWidth: '110px'
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    marginRight: '10px',
    minWidth: '500px',
    //width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: 'auto',
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    width: '100%',
  },
  inputInput: {
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
  },
  divider: {
    margin: '10px',
  },
}));

const apiURL = "http://localhost:3000/search"

export default function Searches() {
  const [query, setQuery] = React.useState('');
  const [data, setData] = React.useState();
  const classes = useStyles();

  React.useEffect(() => {
    const fetchData = async () => {

      const response = await axios({
        "method": "POST",
        "url": apiURL,
        "headers": {
          "content-type": "text/plain",
        },
        data: query
      });

      console.log('Results:', response.data)
      setData(response.data)
    };
    if (query.length > 0) {
      fetchData();
    }
  }, [query]);

  const handleChange = e => {
    e.preventDefault();
    setQuery(e.target.value);
  };

  return (
    <div>
      <div className={classes.searchBar}>
        <div className={classes.search}>
          <div className={classes.searchIcon}>
            <SearchIcon />
          </div>
          <InputBase onChange={handleChange}
            placeholder="Search books..."
            value={query}
            classes={{
              root: classes.inputRoot,
              input: classes.inputInput,
            }}
            inputProps={{ 'aria-label': 'search' }}
          />
        </div>
      </div>
      {/* MongoDB data */}
      {data && data[0]?.title !== undefined &&
        <Grid container className={classes.grid} spacing={2}>
          {data.map((row) => (
            <Grid item xs={3}>
              <Card className={classes.card}>
                <CardActionArea>
                  <CardMedia
                    className={classes.media}
                    image={row.thumbnailUrl}
                    title={row.title}
                  />
                  <CardContent>
                    <Typography variant="h6">
                      {row.title}
                    </Typography>
                    <Typography color="primary" >
                      {row.authors.map(author => author.concat(", "))}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" >
                      {row.shortDescription}
                    </Typography>
                    <Divider variant="middle" className={classes.divider} />
                    <Typography>
                      ISBN: {row.isbn}
                    </Typography>
                    <Typography>
                      Status: {row.status}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      }
      {/* ElasticSearchData */}
      {data && data[0]?._source?.title !== undefined &&
        <Grid container className={classes.grid} spacing={2}>
          {data.map((row) => (
            <Grid item xs={3}>
              <Card className={classes.card}>
                <CardActionArea>
                  <CardMedia
                    className={classes.media}
                    image={row._source.thumbnailUrl}
                    title={row._source.title}
                  />
                  <CardContent>
                    <Typography variant="h6">
                      {row._source.title}
                    </Typography>
                    <Typography color="primary" >
                      {row._source.authors.map(author => author.concat(", "))}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" >
                      {row._source.shortDescription}
                    </Typography>
                    <Divider variant="middle" className={classes.divider} />
                    <Typography>
                      ISBN: {row._source.isbn}
                    </Typography>
                    <Typography>
                      Status: {row._source.status}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      }
    </div>
  );
}