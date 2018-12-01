import React, { Component } from "react";
import {
  Container,
  Header,
  Title,
  Content,
  Button,
  Icon,
  Left,
  Right,
  Body,
  Text
} from "native-base";
import styles from "./styles";

class Header6 extends Component {
  render() {
    return (
      <Container style={styles.container}>
        <Header>
          <Left>
            <Button transparent onPress={() => this.props.navigation.goBack()}>
              <Icon name="ios-arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>Header</Title>
          </Body>
          <Right>
            <Button transparent>
              <Icon name="ios-search" />
            </Button>
            <Button transparent>
              <Icon name="ios-heart" />
            </Button>
            <Button transparent>
              <Icon name="ios-more" />
            </Button>
          </Right>
        </Header>

        <Content padder>
          <Text>Header with multiple Icon Buttons</Text>
        </Content>
      </Container>
    );
  }
}

export default Header6;
