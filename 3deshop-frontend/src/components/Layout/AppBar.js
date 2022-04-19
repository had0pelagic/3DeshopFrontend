import React, { useState, useEffect } from "react";
import JwtHelper from "../../utils/jwt.helper";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import ViewInArIcon from "@mui/icons-material/ViewInAr";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import AddIcon from "@mui/icons-material/Add";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import api from "../../api";

const menuItems = [
  {
    title: "Products",
    url: "/products",
  },
];

const ResponsiveAppBar = () => {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [username, setUsername] = useState("");
  const [user, setUser] = useState();
  const [userBalance, setUserBalance] = useState();
  const [id, setId] = useState("");
  const { onLogout, getToken } = useAuth();

  useEffect(async () => {
    if (getToken().data !== null) {
      const token = getToken().data;
      const jwt = JwtHelper.getUser(token);
      setUsername(jwt.username);
      setId(jwt.userId);
      await getUser(jwt.userId);
    }
  }, [getToken]);

  const getUser = async (id) => {
    const response = await api.users.getUser(id);

    if (response.status === 200) {
      setUser(response.data);
    } else {
      console.log("error at account page, didn't return 200");
    }
  };

  const getUserBalance = async (id) => {
    const response = await api.balance.getUserBalance(id);

    if (response.status === 200) {
      setUserBalance(response.data.balance);
    } else {
      console.log("error at getting user balance, didn't return 200");
    }
  };

  useEffect(async () => {
    const token = getToken().data;
    if (token !== null) {
      const jwt = JwtHelper.getUser(token);
      await getUserBalance(jwt.userId);
    }
  }, [getUserBalance]);

  const handleLogout = () => {
    onLogout();
    setUsername("");
    setId("");
  };

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const Drawer = () => {
    return (
      <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }} style={{}}>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="menu-appbar"
          aria-haspopup="true"
          onClick={handleOpenNavMenu}
          color="inherit"
        >
          <MenuIcon />
        </IconButton>
        <Menu
          id="menu-appbar"
          anchorEl={anchorElNav}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          keepMounted
          transformOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
          open={Boolean(anchorElNav)}
          onClose={handleCloseNavMenu}
          sx={{
            display: { xs: "block", md: "none" },
          }}
        >
          {menuItems.map((item) => (
            <MenuItem key={item.title} component={Link} to={item.url}>
              <Typography>{item.title}</Typography>
            </MenuItem>
          ))}

          {username ? (
            <div style={{ display: "flex" }}>
              <MenuItem key={"Orders"} component={Link} to={"/orders"}>
                <Typography>Orders</Typography>
              </MenuItem>
            </div>
          ) : (
            <div></div>
          )}
        </Menu>
      </Box>
    );
  };

  const NavItems = () => {
    return (
      <Box
        sx={{
          flexGrow: 1,
          display: {
            xs: "none",
            md: "flex",
          },
        }}
      >
        {menuItems.map((item) => (
          <MenuItem key={item.title} component={Link} to={item.url}>
            <Typography>{item.title}</Typography>
          </MenuItem>
        ))}

        {username ? (
          <div style={{ display: "flex" }}>
            <MenuItem key={"Orders"} component={Link} to={"/orders"}>
              <Typography>Orders</Typography>
            </MenuItem>
          </div>
        ) : (
          <div></div>
        )}
      </Box>
    );
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: "#262A53" }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            sx={{ mr: 2, display: { xs: "none", md: "flex" } }}
            component={Link}
            to={`/`}
          >
            <ViewInArIcon sx={{ fontSize: 50, color: "white" }} />
          </Typography>
          <Drawer />
          <Typography
            variant="h6"
            noWrap
            sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}
            component={Link}
            to={`/`}
          >
            <ViewInArIcon sx={{ fontSize: 50, color: "white" }} />
          </Typography>
          <NavItems />
          {user ? (
            <Box sx={{ flexGrow: 0 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "row",
                  flex: 1,
                }}
              >
                <IconButton
                  onClick={handleOpenUserMenu}
                  sx={{ p: 0, marginLeft: 5 }}
                >
                  <Avatar
                    alt="Avatar"
                    src={`${user.image.format},${user.image.data}`}
                  />
                  <Typography style={{ marginLeft: 20, color: "white" }}>
                    {username}
                  </Typography>
                </IconButton>

                <IconButton
                  component={Link}
                  to={`/user-balance-top-up/${id}`}
                  sx={{ p: 0, marginLeft: 5 }}
                >
                  <Typography style={{ color: "white" }}>
                    {userBalance} C
                  </Typography>
                  <AddIcon sx={{ color: "white" }}></AddIcon>
                </IconButton>
              </div>
              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                <MenuItem
                  key={"Account"}
                  component={Link}
                  to={`/account/${id}`}
                >
                  <Typography> My account</Typography>
                </MenuItem>

                <MenuItem
                  key={"Bought products"}
                  component={Link}
                  to={`/user-downloads/${id}`}
                >
                  <Typography>My bought products</Typography>
                </MenuItem>

                <MenuItem
                  key={"User orders"}
                  component={Link}
                  to={`/user-orders/${id}`}
                >
                  <Typography>My orders</Typography>
                </MenuItem>

                <MenuItem key={"User jobs"} component={Link} to={`/user-jobs`}>
                  <Typography>My jobs</Typography>
                </MenuItem>

                <MenuItem
                  key={"Change password"}
                  component={Link}
                  to={`/change-password/${id}`}
                >
                  <Typography>Change password</Typography>
                </MenuItem>

                <MenuItem key={"Logout"} onClick={handleLogout}>
                  <Typography>Logout</Typography>
                </MenuItem>
              </Menu>
            </Box>
          ) : (
            <div style={{ display: "flex" }}>
              <MenuItem key={"Login"} component={Link} to={"/login"}>
                <Typography>Login</Typography>
              </MenuItem>
              <MenuItem key={"Register"} component={Link} to={"/register"}>
                <Typography>Register</Typography>
              </MenuItem>
            </div>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default ResponsiveAppBar;
