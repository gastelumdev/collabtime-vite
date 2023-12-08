import { useSearchAllMutation } from "../../app/services/api";
import { useNavigate } from "react-router-dom";
import { Box, Button, Flex, HStack, Input, InputGroup, InputLeftElement, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import { IconContext } from "react-icons";
import { FaSearch } from "react-icons/fa";
import { TDataCollection, TDocument, TWorkspace } from "../../types";
// import DataCollection from "../dataCollections/DataCollection";
import UpdateModal from "../documents/UpdateModal";

interface IProps {
    onClose: any;
}

const SearchContent = ({ onClose }: IProps) => {
    const navigate = useNavigate();
    const [searchAll] = useSearchAllMutation();
    const [searchInputText, setSearchInputText] = useState<string>("");
    const [data, setData] = useState<{
        workspaces: TWorkspace[];
        dataCollections: TDataCollection[];
        docs: TDocument[];
    }>({ workspaces: [], dataCollections: [], docs: [] });
    const [tabSelectedName, setTabSelectedName] = useState<string>("all");
    // const [tagInputActive, setTagInputActive] = useState<boolean>(false);

    const handleSearchInputChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchInputText(event.target.value);
        const res: any = await searchAll({ key: event.target.value });
        console.log(res.data);
        setData({ workspaces: res.data.workspaces, dataCollections: res.data.dataCollections, docs: res.data.docs });
    };

    const handleLinkClick = (to: string) => {
        navigate(to);
        onClose();
    };

    return (
        <>
            <Box>
                <Flex>
                    <InputGroup mb={"16px"}>
                        <InputLeftElement>
                            <IconContext.Provider
                                value={{
                                    size: "12px",
                                    color: "#7b809a",
                                }}
                            >
                                <FaSearch />
                            </IconContext.Provider>
                        </InputLeftElement>
                        <Input
                            size={"md"}
                            placeholder={"Search..."}
                            value={searchInputText}
                            onChange={handleSearchInputChange}
                        />
                    </InputGroup>
                </Flex>
            </Box>
            {searchInputText !== "" ? (
                <>
                    <HStack>
                        <Box w={"150px"}>
                            <Button
                                w={"145px"}
                                variant={tabSelectedName === "all" ? "solid" : "ghost"}
                                mr={"20px"}
                                onClick={() => setTabSelectedName("all")}
                            >
                                All
                            </Button>
                        </Box>
                        {/* <Button variant={"unstyled"} mr={"20px"}>
                    Data
                </Button> */}
                        <Box w={"150px"}>
                            <Button
                                w={"145px"}
                                variant={tabSelectedName === "workspaces" ? "solid" : "ghost"}
                                mr={"20px"}
                                onClick={() => setTabSelectedName("workspaces")}
                            >
                                Workspaces
                            </Button>
                        </Box>
                        <Box w={"150px"}>
                            <Button
                                w={"145px"}
                                variant={tabSelectedName === "dataCollections" ? "solid" : "ghost"}
                                mr={"20px"}
                                onClick={() => setTabSelectedName("dataCollections")}
                            >
                                Data Collections
                            </Button>
                        </Box>
                        <Box w={"150px"}>
                            <Button
                                w={"145px"}
                                variant={tabSelectedName === "docs" ? "solid" : "ghost"}
                                mr={"20px"}
                                onClick={() => setTabSelectedName("docs")}
                            >
                                Documents
                            </Button>
                        </Box>
                    </HStack>
                    <Box mt={"30px"}>
                        {tabSelectedName === "all" && data.workspaces.length > 0 ? (
                            <Box mb={"8px"}>
                                <Text as={"b"} color={"rgb(123, 128, 154)"}>
                                    Workspaces
                                </Text>
                            </Box>
                        ) : null}
                        {tabSelectedName === "all" || tabSelectedName === "workspaces"
                            ? data.workspaces.map((workspace, index) => {
                                  return (
                                      <Box key={index}>
                                          <Text
                                              color={"rgb(123, 128, 154)"}
                                              cursor={"pointer"}
                                              onClick={() => handleLinkClick(`/workspaces/${workspace._id}`)}
                                          >
                                              {workspace.name}
                                          </Text>
                                      </Box>
                                  );
                              })
                            : null}
                    </Box>
                    <Box mt={"30px"}>
                        {tabSelectedName === "all" && data.dataCollections.length > 0 ? (
                            <Box mb={"8px"}>
                                <Text as={"b"} color={"rgb(123, 128, 154)"}>
                                    Data Collections
                                </Text>
                            </Box>
                        ) : null}
                        {tabSelectedName === "all" || tabSelectedName === "dataCollections"
                            ? data.dataCollections.map((dataCollection, index) => {
                                  return (
                                      <Box key={index}>
                                          <Text
                                              color={"rgb(123, 128, 154)"}
                                              cursor={"pointer"}
                                              onClick={() =>
                                                  handleLinkClick(
                                                      `/workspaces/${dataCollection.workspace}/dataCollections/${dataCollection._id}`
                                                  )
                                              }
                                          >
                                              {dataCollection.name}
                                          </Text>
                                      </Box>
                                  );
                              })
                            : null}
                    </Box>
                    <Box mt={"30px"}>
                        {tabSelectedName === "all" && data.docs.length > 0 ? (
                            <Box mb={"8px"}>
                                <Text as={"b"} color={"rgb(123, 128, 154)"}>
                                    Documents
                                </Text>
                            </Box>
                        ) : null}
                        {tabSelectedName === "all" || tabSelectedName === "docs"
                            ? data.docs.map((doc, index) => {
                                  return (
                                      <Box key={index}>
                                          {doc.type === "upload" ? (
                                              <Text color={"rgb(123, 128, 154)"}>
                                                  <a href={doc.url} target="_blank">
                                                      {doc.filename}
                                                  </a>
                                              </Text>
                                          ) : (
                                              <UpdateModal document={doc} />
                                          )}
                                      </Box>
                                  );
                              })
                            : null}
                    </Box>
                </>
            ) : null}
        </>
    );
};

export default SearchContent;
