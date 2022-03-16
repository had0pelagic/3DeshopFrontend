import React, { useState, useEffect } from "react";
import JwtHelper from "../../utils/jwt.helper";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const settings = ["Profile", "Dashboard"];
const menuItems = [
  {
    title: "Home",
    url: "/",
  },
  {
    title: "Register",
    url: "/register",
  },
  {
    title: "Login",
    url: "/login",
  },
  {
    title: "Products",
    url: "/products",
  },
  {
    title: "Upload product",
    url: "/upload-product",
  },
];

const ResponsiveAppBar = () => {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [username, setUsername] = useState("");
  const [id, setId] = useState("");
  const { onLogout, getToken } = useAuth();

  useEffect(() => {
    if (getToken().data !== null) {
      const token = getToken().data;
      const jwt = JwtHelper.getUser(token);
      setUsername(jwt.username);
      setId(jwt.userId);
    }
  }, [getToken]);

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
            <MenuItem key={item.title} onClick={handleCloseNavMenu}>
              <Button
                component={Link}
                to={item.url}
                style={{
                  color: "black",
                }}
              >
                {item.title}
              </Button>
            </MenuItem>
          ))}
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
        {menuItems.map((item, index) => (
          <Button
            key={index}
            component={Link}
            to={item.url}
            style={{
              color: "white",
            }}
          >
            {item.title}
          </Button>
        ))}
      </Box>
    );
  };

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ mr: 2, display: { xs: "none", md: "flex" } }}
          >
            LOGO
          </Typography>
          <Drawer />
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}
          >
            LOGO
          </Typography>
          <NavItems />
          {username && (
            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar
                    alt="Avatar"
                    src="https://w7.pngwing.com/pngs/605/198/png-transparent-computer-icons-avatar-avatar-web-design-heroes-development.png"
                  />
                </IconButton>
              </Tooltip>
              <Typography>{username}</Typography>
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
                {settings.map((setting) => (
                  <MenuItem key={setting} onClick={handleCloseUserMenu}>
                    <Typography textAlign="center">{setting}</Typography>
                  </MenuItem>
                ))}
                <MenuItem>
                  <Button
                    key={"Account"}
                    component={Link}
                    to={`/account/${id}`}
                  >
                    Account
                  </Button>
                </MenuItem>
                <MenuItem>
                  <Button
                    key={"Bought products"}
                    component={Link}
                    to={`/user-downloads/${id}`}
                  >
                    Bought products
                  </Button>
                </MenuItem>
                <MenuItem>
                  <Button
                    key={"Change password"}
                    component={Link}
                    to={`/change-password/${id}`}
                  >
                    Change password
                  </Button>
                </MenuItem>
                <MenuItem key={"Logout"} onClick={handleCloseUserMenu}>
                  <Button onClick={handleLogout}>Logout</Button>
                </MenuItem>
              </Menu>
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default ResponsiveAppBar;
