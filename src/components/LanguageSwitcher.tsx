import { Box, Button, Flex, Menu, Portal, Text } from "@chakra-ui/react";
import { useLanguage, type Language } from "@/i18n";

const languages: Array<{
  value: Language;
  shortLabel: string;
  direction: string;
}> = [
  { value: "en", shortLabel: "EN", direction: "LTR" },
  { value: "fa", shortLabel: "FA", direction: "RTL" },
];

function GlobeIcon() {
  return (
    <svg aria-hidden="true" fill="none" height="18" viewBox="0 0 24 24" width="18">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M3.6 9h16.8M3.6 15h16.8M12 3c2.2 2.45 3.35 5.45 3.35 9S14.2 18.55 12 21c-2.2-2.45-3.35-5.45-3.35-9S9.8 5.45 12 3Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg aria-hidden="true" fill="none" height="14" viewBox="0 0 24 24" width="14">
      <path
        d="m5 12 4.5 4.5L19 7"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.5"
      />
    </svg>
  );
}

export default function LanguageSwitcher() {
  const { language, setLanguage, t } = useLanguage();
  const selectedLanguage =
    languages.find((item) => item.value === language) ?? languages[0];

  return (
    <Menu.Root positioning={{ placement: "bottom-end", gutter: 8 }}>
      <Menu.Trigger asChild>
        <Button
          aria-label={`${t("common.language")}: ${t(`languages.${language}`)}`}
          bg="transparent"
          border="none"
          borderRadius="xl"
          color="gray.700"
          h="44px"
          minW={{ base: "44px", sm: "168px" }}
          px={{ base: 0, sm: 2.5 }}
          transition="all 0.2s ease"
          variant="ghost"
          _hover={{
            bg: "transparent",
            color: "blue.700",
            transform: "scale(1.02)",
          }}
          _open={{
            bg: "transparent",
            color: "blue.700",
            transform: "scale(1.02)",
          }}
          _focusVisible={{ boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.25)" }}
        >
          <Flex align="center" gap={2.5} w="full">
            <Flex
              align="center"
              bg="blue.50"
              borderRadius="lg"
              color="blue.600"
              flexShrink={0}
              h="30px"
              justify="center"
              w="30px"
            >
              <GlobeIcon />
            </Flex>

            <Box
              display={{ base: "none", sm: "block" }}
              flex="1"
              minW={0}
              textAlign="start"
            >
              <Text
                color="gray.500"
                fontSize="10px"
                fontWeight="700"
                lineHeight="1"
                mb={1}
              >
                {t("common.language").toUpperCase()}
              </Text>
              <Text
                color="gray.800"
                fontSize="sm"
                fontWeight="700"
                lineHeight="1"
                truncate
              >
                {t(`languages.${language}`)}
              </Text>
            </Box>
          </Flex>
        </Button>
      </Menu.Trigger>

      <Portal>
        <Menu.Positioner>
          <Menu.Content
            bg="white"
            borderColor="gray.200"
            borderRadius="2xl"
            borderWidth="1px"
            boxShadow="0 20px 45px rgba(15, 23, 42, 0.16)"
            minW="240px"
            p={2}
          >
            <Box px={2.5} pb={2} pt={1.5}>
              <Text color="gray.900" fontSize="sm" fontWeight="800">
                {t("common.language")}
              </Text>
              <Text color="gray.500" fontSize="xs" mt={0.5}>
                {selectedLanguage.shortLabel} / {selectedLanguage.direction}
              </Text>
            </Box>

            <Menu.Separator borderColor="gray.100" mb={1.5} />

            <Menu.RadioItemGroup
              value={language}
              onValueChange={(event) => setLanguage(event.value as Language)}
            >
              {languages.map((item) => {
                const isSelected = item.value === language;

                return (
                  <Menu.RadioItem
                    key={item.value}
                    borderRadius="xl"
                    cursor="pointer"
                    gap={3}
                    minH="54px"
                    px={2.5}
                    value={item.value}
                    _highlighted={{ bg: "blue.50" }}
                  >
                    <Flex
                      align="center"
                      bg={isSelected ? "blue.600" : "gray.100"}
                      borderRadius="lg"
                      color={isSelected ? "white" : "gray.600"}
                      flexShrink={0}
                      fontSize="xs"
                      fontWeight="800"
                      h="34px"
                      justify="center"
                      letterSpacing="0.04em"
                      w="38px"
                    >
                      {item.shortLabel}
                    </Flex>

                    <Box flex="1">
                      <Text color="gray.800" fontSize="sm" fontWeight="700">
                        {t(`languages.${item.value}`)}
                      </Text>
                      <Text color="gray.500" fontSize="xs" mt={0.5}>
                        {item.shortLabel} / {item.direction}
                      </Text>
                    </Box>

                    <Flex
                      align="center"
                      bg={isSelected ? "blue.600" : "transparent"}
                      borderColor={isSelected ? "blue.600" : "gray.300"}
                      borderRadius="full"
                      borderWidth="1px"
                      color="white"
                      flexShrink={0}
                      h="22px"
                      justify="center"
                      w="22px"
                    >
                      {isSelected && <CheckIcon />}
                    </Flex>
                  </Menu.RadioItem>
                );
              })}
            </Menu.RadioItemGroup>
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  );
}
